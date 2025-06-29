"use client";

import { Card, CardContent, Typography } from "@mui/material";
import { Draggable } from "@hello-pangea/dnd";

/**
 * TaskCard renders individual draggable task cards.
 * Clicking the card triggers editing via onEditTask callback.
 *
 * @param {Task} task - Task object containing id, title, description, etc.
 * @param {number} index - Index for draggable ordering.
 * @param {(task: Task) => void} onEditTask - Callback to open edit modal on click.
 */
export default function TaskCard({ task, index, onEditTask }) {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{ mb: 1, cursor: "pointer" }}
          onClick={() => onEditTask(task)} // Open edit modal on click
        >
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold">
              {task.title}
            </Typography>
            <Typography variant="body2">{task.description}</Typography>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}
