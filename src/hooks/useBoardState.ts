import { useCallback, useEffect, useState } from "react";
import type { BoardState, ColumnId, Task } from "@/lib/kanban";
import { STORAGE_KEY, createDefaultBoardState, createRandomId } from "@/lib/kanban";

const parseTask = (task: unknown): Task | null => {
  if (typeof task !== "object" || task === null) {
    return null;
  }

  const maybeTask = task as Partial<Task>;
  if (
    typeof maybeTask.id !== "string" ||
    typeof maybeTask.title !== "string" ||
    typeof maybeTask.columnId !== "string"
  ) {
    return null;
  }

  if (!["todo", "in-progress", "done"].includes(maybeTask.columnId)) {
    return null;
  }

  return {
    id: maybeTask.id,
    title: maybeTask.title,
    description: typeof maybeTask.description === "string" ? maybeTask.description : undefined,
    columnId: maybeTask.columnId as ColumnId,
    createdAt: typeof maybeTask.createdAt === "string" ? maybeTask.createdAt : new Date().toISOString(),
  };
};

const parseBoardState = (value: string | null): BoardState | null => {
  if (!value) {
    return null;
  }

  try {
    const raw = JSON.parse(value) as Partial<BoardState>;
    if (!Array.isArray(raw.tasks)) {
      return null;
    }

    const tasks: Task[] = raw.tasks
      .map((task) => parseTask(task))
      .filter((task): task is Task => Boolean(task));

    return { tasks };
  } catch {
    return null;
  }
};

export interface UseBoardStateResult {
  tasks: Task[];
  addTask: (title: string, description?: string) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, targetColumn: ColumnId) => void;
  isReady: boolean;
}

export const useBoardState = (): UseBoardStateResult => {
  const [state, setState] = useState<BoardState>({ tasks: [] });
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedState = parseBoardState(window.localStorage.getItem(STORAGE_KEY));
    if (savedState) {
      setState(savedState);
    } else {
      setState(createDefaultBoardState());
    }

    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !hasHydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hasHydrated, state]);

  const addTask = useCallback((title: string, description?: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    const trimmedDescription = description?.trim();
    setState((prev) => ({
      tasks: [
        ...prev.tasks,
        {
          id: createRandomId(),
          title: trimmedTitle,
          description: trimmedDescription ? trimmedDescription : undefined,
          columnId: "todo",
          createdAt: new Date().toISOString(),
        },
      ],
    }));
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    setState((prev) => ({
      tasks: prev.tasks.filter((task) => task.id !== taskId),
    }));
  }, []);

  const moveTask = useCallback((taskId: string, targetColumn: ColumnId) => {
    setState((prev) => {
      const taskIndex = prev.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex === -1) {
        return prev;
      }

      const task = prev.tasks[taskIndex];
      if (task.columnId === targetColumn) {
        return prev;
      }

      const updatedTask: Task = { ...task, columnId: targetColumn };
      const tasks = [...prev.tasks];
      tasks.splice(taskIndex, 1);
      tasks.push(updatedTask);
      return { tasks };
    });
  }, []);

  return {
    tasks: state.tasks,
    addTask,
    deleteTask,
    moveTask,
    isReady: hasHydrated,
  };
};
