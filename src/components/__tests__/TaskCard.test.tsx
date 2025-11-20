import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TaskCard } from "../TaskCard";
import type { Task } from "@/lib/kanban";

const task: Task = {
  id: "task-42",
  title: "Ship release",
  description: "Deploy the current main branch to production.",
  columnId: "done",
  createdAt: new Date("2024-02-01").toISOString()
};

const createDataTransfer = () => {
  const store: Record<string, string> = {};
  return {
    dropEffect: "none",
    effectAllowed: "none",
    files: [] as unknown as FileList,
    items: [] as unknown as DataTransferItemList,
    types: [],
    setData: jest.fn((format: string, value: string) => {
      store[format] = value;
    }),
    getData: jest.fn((format: string) => store[format]),
    clearData: jest.fn(),
    setDragImage: jest.fn()
  } as unknown as DataTransfer;
};

describe("TaskCard", () => {
  it("shows the task details and allows deleting it", async () => {
    const user = userEvent.setup();
    const handleDelete = jest.fn();

    render(<TaskCard task={task} onDelete={handleDelete} />);

    expect(screen.getByRole("heading", { name: task.title })).toBeVisible();
    expect(screen.getByText(task.description!)).toBeInTheDocument();
    expect(screen.getByText(/Created/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete ship release/i }));

    expect(handleDelete).toHaveBeenCalledWith(task.id);
  });

  it("populates the drag payload with the task id", () => {
    const handleDelete = jest.fn();
    const dataTransfer = createDataTransfer();

    render(<TaskCard task={task} onDelete={handleDelete} />);

    const card = screen.getByRole("heading", { name: task.title }).closest("[draggable='true']");
    expect(card).toBeTruthy();

    fireEvent.dragStart(card!, { dataTransfer });

    expect(dataTransfer.setData).toHaveBeenCalledWith("text/plain", task.id);
    expect(dataTransfer.effectAllowed).toBe("move");
    expect(handleDelete).not.toHaveBeenCalled();
  });
});
