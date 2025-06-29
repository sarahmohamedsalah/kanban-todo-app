"use client";

import { Box, Typography, Button } from "@mui/material";
import TaskCard from "./TaskCard";
import { Droppable } from "@hello-pangea/dnd";
import { useState } from "react";
import TaskFormModal from "./TaskFormModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask } from "../services/api";

export default function TaskColumn({
  columnKey,
  title,
  tasks,
  onEditTask,
  onDeleteTask,
}) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return (
    <Box sx={{ width: 300 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title} ({tasks.length})
      </Typography>

      <Droppable droppableId={columnKey}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              backgroundColor: "#f5f5f5",
              minHeight: 300,
              borderRadius: 1,
              p: 1,
            }}
          >
            {/* Pass onEditTask prop to each TaskCard */}
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                onEditTask={onEditTask}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      <Button
        fullWidth
        variant="outlined"
        sx={{ mt: 1 }}
        onClick={() => setOpen(true)}
      >
        + Add Task
      </Button>

      <TaskFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => {
          create.mutate(data);
        }}
        initialData={{ column: columnKey, title: "", description: "" }}
      />
    </Box>
  );
}
