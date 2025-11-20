export type ColumnId = "todo" | "in-progress" | "done";

export interface Column {
  id: ColumnId;
  title: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  columnId: ColumnId;
  createdAt: string;
}

export interface BoardState {
  tasks: Task[];
}

export const STORAGE_KEY = "kanban-board";

export const COLUMNS: Column[] = [
  { id: "todo", title: "Todo" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

const STARTER_TASKS: Array<Omit<Task, "id" | "createdAt">> = [
  {
    title: "Explore Universe",
    description: "Read about new space missions.",
    columnId: "todo",
  },
  {
    title: "Build muscles",
    description: "Stick to the weekly workout plan.",
    columnId: "in-progress",
  },
  {
    title: "Deploy app",
    description: "Ship the latest release to production.",
    columnId: "done",
  },
];

export const createRandomId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const createDefaultBoardState = (): BoardState => ({
  tasks: STARTER_TASKS.map((task) => ({
    ...task,
    id: createRandomId(),
    createdAt: new Date().toISOString(),
  })),
});
