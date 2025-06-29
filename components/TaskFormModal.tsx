"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";

/**
 * Task interface defines the shape of a task object.
 * - `id` is optional because new tasks may not have an ID yet.
 */
interface Task {
  id?: number;
  title: string;
  description: string;
  column: string;
}

/**
 * Props for TaskFormModal component.
 * - `open`: boolean controlling whether the modal is visible.
 * - `onClose`: callback to close the modal.
 * - `onSubmit`: callback to handle submission of task data.
 * - `initialData`: initial task data to populate the form (empty for new task).
 */
interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (task: Task) => void;
  initialData: Task;
}

/**
 * TaskFormModal component renders a modal dialog
 * with form inputs to create or edit a task.
 */
export default function TaskFormModal({
  open,
  onClose,
  onSubmit,
  initialData,
}: TaskFormModalProps) {
  // Local state to control form inputs
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [column, setColumn] = useState<string>("backlog");

  /**
   * Synchronize local state with incoming `initialData` when it changes.
   * Ensures the form inputs reflect current task data for editing.
   */
  useEffect(() => {
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setColumn(initialData.column || "backlog");
  }, [initialData]);

  /**
   * Handle form submission by calling parent's onSubmit callback
   * with the updated task data, then close the modal.
   */
  const handleSubmit = () => {
    onSubmit({ ...initialData, title, description, column });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      {/* Modal header: changes text based on whether editing or adding */}
      <DialogTitle>{initialData.id ? "Edit Task" : "Add Task"}</DialogTitle>

      {/* Modal content containing form inputs */}
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Title input */}
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Description multiline input */}
          <TextField
            label="Description"
            value={description}
            multiline
            minRows={3}
            onChange={(e) => setDescription(e.target.value)}
          />
          {/* Dropdown to select task column */}
          <TextField
            select
            label="Column"
            value={column}
            onChange={(e) => setColumn(e.target.value)}
          >
            <MenuItem value="backlog">Backlog</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="review">Review</MenuItem>
            <MenuItem value="done">Done</MenuItem>
          </TextField>
        </Box>
      </DialogContent>

      {/* Modal action buttons */}
      <DialogActions>
        {/* Cancel button closes modal without saving */}
        <Button onClick={onClose}>Cancel</Button>
        {/* Submit button creates or updates task */}
        <Button onClick={handleSubmit} variant="contained">
          {initialData.id ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
