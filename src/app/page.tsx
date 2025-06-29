"use client";

import { useState } from "react";
import { Box, Typography, TextField } from "@mui/material";
import TaskColumn from "../../components/TaskColumn";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, updateTask } from "../../services/api";

import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Task } from "../app/types";
import TaskFormModal from "../../components/TaskFormModal"; // import modal

/**
 * HomePage component renders the Kanban board with tasks
 * organized by columns, supports search, drag-and-drop, and task updates.
 */
export default function HomePage() {
  // State to track current search query for filtering tasks
  const [searchQuery, setSearchQuery] = useState("");

  // State to track the task currently being edited; null means no modal open
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  /**
   * Fetch tasks using React Query with search filtering.
   * The query is re-fetched automatically when `searchQuery` changes.
   */
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["tasks", searchQuery],
    queryFn: ({ queryKey, signal }) => {
      // Destructure to get search string (ignore first key)
      const [, search] = queryKey as [string, string];
      return getTasks({ search, signal });
    },
  });

  const queryClient = useQueryClient();

  /**
   * Mutation hook to update a task on the backend.
   * On success, it invalidates the tasks query to refetch updated data.
   */
  const moveTask = useMutation<Task, Error, Task>({
    mutationFn: (task) => updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  /**
   * Mutation hook specifically for editing/updating tasks via modal.
   * On success, refetch tasks and close modal.
   */
  const updateTaskMutation = useMutation<Task, Error, Task>({
    mutationFn: (task) => updateTask(task.id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingTask(null);
    },
  });

  /**
   * Handler for drag end event triggered by @hello-pangea/dnd.
   * Updates the task's column locally (optimistic update)
   * and triggers backend update mutation.
   */
  const handleDragEnd = (result: DropResult) => {
    // If dropped outside any droppable area, do nothing
    if (!result.destination) return;

    const taskId = Number(result.draggableId); // ID of the dragged task
    const newColumn = result.destination.droppableId; // ID of the destination column

    // Find the dragged task from current tasks
    const task = tasks.find((t) => t.id === taskId);

    // If the task exists and column changed, update it
    if (task && task.column !== newColumn) {
      // Optimistically update the local cache for instant UI feedback
      queryClient.setQueryData<Task[]>(["tasks", searchQuery], (old = []) =>
        old.map((t) => (t.id === taskId ? { ...t, column: newColumn } : t))
      );

      // Trigger backend update mutation to persist change
      moveTask.mutate({ ...task, column: newColumn });
    }
  };

  // Define the fixed columns of the Kanban board
  const columns = ["backlog", "in_progress", "review", "done"];

  /**
   * Filters tasks for a given column and matches against search query.
   * Performs case-insensitive search on title and description fields.
   */
  const getTasksByColumn = (col: string) =>
    tasks.filter(
      (t) =>
        t.column === col &&
        (t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  /**
   * Handler to open the edit modal for a specific task.
   * This will be passed down to TaskColumn -> TaskCard.
   */
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  return (
    <>
      {/* Main header */}
      <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
        Home Renovation 🏠
      </Typography>

      {/* Search input box */}
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ display: "block", mx: "auto", width: 300 }}
      />

      {/* DragDropContext enables drag-and-drop behavior for child droppables/draggables */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 4 }}>
          {/* Render a column for each defined column key, passing edit handler */}
          {columns.map((col) => (
            <TaskColumn
              key={col}
              columnKey={col}
              title={col.replace("_", " ").toUpperCase()}
              tasks={getTasksByColumn(col)}
              onEditTask={handleEditTask} // pass correctly typed callback
            />
          ))}
        </Box>
      </DragDropContext>

      {/* Edit task modal; opens when editingTask is not null */}
      {editingTask && (
        <TaskFormModal
          open={!!editingTask}
          initialData={editingTask}
          onClose={() => setEditingTask(null)}
          onSubmit={(updatedTask) => {
            if (updatedTask.id !== undefined) {
              updateTaskMutation.mutate({
                ...updatedTask,
                id: updatedTask.id, // Ensure id is defined
              });
            } else {
              console.error("Task ID is undefined. Cannot update task.");
            }
          }}
        />
      )}
    </>
  );
}
