import { render, screen, fireEvent } from "@testing-library/react";
import { Column } from "../Column";
import type { Task } from "@/lib/kanban";

const baseTasks: Task[] = [
  {
    id: "task-1",
    title: "Draft launch plan",
    description: "Outline the steps needed for launch day.",
    columnId: "todo",
    createdAt: new Date("2024-01-01").toISOString()
  },
  {
    id: "task-2",
    title: "Review design",
    description: "Align on final visual tweaks.",
    columnId: "todo",
    createdAt: new Date("2024-01-02").toISOString()
  }
];

describe("Column", () => {
  it("renders the title, task count and all task cards", () => {
    render(
      <Column
        column={{ id: "todo", title: "Todo" }}
        tasks={baseTasks}
        onMoveTask={jest.fn()}
        onDeleteTask={jest.fn()}
      />
    );

    expect(screen.getByRole("heading", { level: 2, name: "Todo" })).toBeVisible();
    expect(screen.getByText(String(baseTasks.length))).toBeInTheDocument();
    baseTasks.forEach((task) => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it("moves a task to the column when a drag payload is dropped", () => {
    const handleMoveTask = jest.fn();

    render(
      <Column
        column={{ id: "todo", title: "Todo" }}
        tasks={baseTasks}
        onMoveTask={handleMoveTask}
        onDeleteTask={jest.fn()}
      />
    );

    const columnSection = screen.getByLabelText(/todo column/i);
    const dataTransfer = {
      getData: jest.fn(() => "task-2")
    } as unknown as DataTransfer;

    fireEvent.drop(columnSection, { dataTransfer });

    expect(dataTransfer.getData).toHaveBeenCalledWith("text/plain");
    expect(handleMoveTask).toHaveBeenCalledWith("task-2", "todo");
  });
});
