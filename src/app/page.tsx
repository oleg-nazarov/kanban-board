"use client";

import { useMemo } from "react";
import { Column } from "@/components/Column";
import { NewTaskForm } from "@/components/NewTaskForm";
import { useBoardState } from "@/hooks/useBoardState";
import { COLUMNS, type ColumnId, type Task } from "@/lib/kanban";
import styles from "./page.module.css";

type TasksByColumn = Record<ColumnId, Task[]>;

export default function Home() {
  const { tasks, addTask, deleteTask, moveTask, isReady } = useBoardState();

  const tasksByColumn = useMemo<TasksByColumn>(() => {
    const grouped: TasksByColumn = {
      todo: [],
      "in-progress": [],
      done: [],
    };

    tasks.forEach((task) => {
      grouped[task.columnId].push(task);
    });

    return grouped;
  }, [tasks]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Kanban Board</h1>
          <p className={styles.subtitle}>
            Plan your work, drag cards across columns, and keep everything in sync with local storage.
          </p>
        </header>

        {isReady ? (
          <>
            <NewTaskForm onAddTask={addTask} />
            <section className={styles.board} aria-label="Kanban board">
              {COLUMNS.map((column) => (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasksByColumn[column.id]}
                  onMoveTask={moveTask}
                  onDeleteTask={deleteTask}
                />
              ))}
            </section>
          </>
        ) : (
          <div className={styles.loading} role="status" aria-live="polite">
            <span className={styles.spinner} aria-hidden />
            <span>Loading board…</span>
          </div>
        )}
      </div>
    </div>
  );
}
