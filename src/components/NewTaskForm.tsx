import { FormEvent, useMemo, useState } from "react";
import styles from "./NewTaskForm.module.css";

interface NewTaskFormProps {
  onAddTask: (title: string, description?: string) => void;
}

export function NewTaskForm({ onAddTask }: NewTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const canSubmit = useMemo(() => title.trim().length > 0, [title]);
  const showError = !canSubmit && title.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      return;
    }

    onAddTask(title, description);
    setTitle("");
    setDescription("");
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formHeader}>
        <h2>Add new task</h2>
        <span className={styles.helper}>New tasks appear in Todo</span>
      </div>

      <div className={styles.inputs}>
        <div className={styles.field}>
          <input
            className={styles.input}
            type="text"
            name="title"
            placeholder="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            aria-label="Task title"
            required
          />
          <p
            className={`${styles.helper} ${styles.message} ${showError ? styles.error : ""}`}
            aria-live="polite"
          >
            {showError ? "Title cannot be empty." : "\u00A0"}
          </p>
        </div>
        <textarea
          className={styles.textarea}
          name="description"
          placeholder="Description (optional)"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          aria-label="Task description"
        />
      </div>

      <div className={styles.actions}>
        <button className={styles.button} type="submit" disabled={!canSubmit}>
          Add task
        </button>
      </div>
    </form>
  );
}
