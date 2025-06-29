// types.ts

/**
 * Represents a single task item in the Kanban board.
 *
 * @property {number} id - Unique identifier for the task.
 * @property {string} title - Brief title or summary of the task.
 * @property {string} description - Detailed description of the task.
 * @property {string} column - The column key indicating the task's current status or category (e.g., 'backlog', 'in_progress', 'done').
 */
export interface Task {
  id: number;
  title: string;
  description: string;
  column: string;
}
