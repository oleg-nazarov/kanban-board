import { DragEvent } from "react";
import type { Task } from "@/lib/kanban";
import styles from "./TaskCard.module.css";

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("text/plain", task.id);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className={styles.card} draggable onDragStart={handleDragStart}>
      <button
        type="button"
        className={styles.removeButton}
        onClick={() => onDelete(task.id)}
        aria-label={`Delete ${task.title}`}
        title="Delete"
      >
        ×
      </button>
      <h3 className={styles.title}>{task.title}</h3>
      {task.description && <p className={styles.description}>{task.description}</p>}
      <p className={styles.meta}>Created {new Date(task.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
