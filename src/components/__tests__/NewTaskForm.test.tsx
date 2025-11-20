import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NewTaskForm } from "../NewTaskForm";

describe("NewTaskForm", () => {
  it("prevents submission until the title is provided and resets the form after submit", async () => {
    const user = userEvent.setup();
    const handleAddTask = jest.fn();

    render(<NewTaskForm onAddTask={handleAddTask} />);

    const titleInput = screen.getByLabelText(/task title/i);
    const descriptionInput = screen.getByLabelText(/task description/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    expect(submitButton).toBeDisabled();

    await user.type(titleInput, "Ship release");
    await user.type(descriptionInput, "Cut the release branch and deploy.");
    await user.click(submitButton);

    expect(handleAddTask).toHaveBeenCalledWith("Ship release", "Cut the release branch and deploy.");
    expect(handleAddTask).toHaveBeenCalledTimes(1);
    expect(titleInput).toHaveValue("");
    expect(descriptionInput).toHaveValue("");
    expect(submitButton).toBeDisabled();
  });

  it("shows an inline error when the user enters only whitespace in the title", async () => {
    const user = userEvent.setup();
    const handleAddTask = jest.fn();

    render(<NewTaskForm onAddTask={handleAddTask} />);

    const titleInput = screen.getByLabelText(/task title/i);
    const submitButton = screen.getByRole("button", { name: /add task/i });

    await user.type(titleInput, "   ");

    expect(screen.getByText("Title cannot be empty.")).toBeVisible();
    expect(submitButton).toBeDisabled();
    expect(handleAddTask).not.toHaveBeenCalled();
  });
});
