import { DragEvent, useState } from "react";
import type { Column as ColumnType, ColumnId, Task } from "@/lib/kanban";
import { TaskCard } from "./TaskCard";
import styles from "./Column.module.css";

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onMoveTask: (taskId: string, target: ColumnId) => void;
  onDeleteTask: (taskId: string) => void;
}

export function Column({ column, tasks, onMoveTask, onDeleteTask }: ColumnProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const nextTarget = event.relatedTarget as Node | null;
    if (!nextTarget || !(event.currentTarget as HTMLElement).contains(nextTarget)) {
      setIsDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const taskId = event.dataTransfer.getData("text/plain");
    if (taskId) {
      onMoveTask(taskId, column.id);
    }
  };

  return (
    <section
      className={`${styles.column} ${isDragging ? styles.columnDropping : ""}`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      aria-label={`${column.title} column`}
    >
      <header className={styles.columnHeader}>
        <h2>{column.title}</h2>
        <span className={styles.count}>{tasks.length}</span>
      </header>
      <div className={styles.tasks}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
        ))}
      </div>
    </section>
  );
}
