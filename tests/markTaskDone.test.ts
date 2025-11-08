import { describe, it, expect, vi, beforeEach } from "vitest";
import { markTaskDone } from "../src/taskManager.js";
import { loadTasks, saveTasks } from "../src/storage.js";
import chalk from "chalk";
import type { Task } from "../src/storage.js";

// Mock dependencies
vi.mock("../src/storage.js", () => ({
  loadTasks: vi.fn(),
  saveTasks: vi.fn(),
}));

const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

describe("markTaskDone", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("marks a task as done and saves the updated list", () => {
    const tasks: Task[] = [
      { id: 1, text: "Buy milk", done: false },
      { id: 2, text: "Do laundry", done: false },
    ];
    (loadTasks as any).mockReturnValue(tasks);

    markTaskDone(2);

    // The second task (index 1, id=2) should be done
    expect(tasks[1].done).toBe(true);
    expect(saveTasks).toHaveBeenCalledWith(tasks);
    expect(mockConsoleLog).toHaveBeenCalledWith(
      chalk.green(`✅ Marked "Do laundry" as done.`)
    );
  });

  it("shows an error if the task id does not exist", () => {
    const tasks: Task[] = [
      { id: 1, text: "Buy milk", done: false },
    ];
    (loadTasks as any).mockReturnValue(tasks);

    markTaskDone(3); // no task at index 3

    expect(saveTasks).not.toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      chalk.red(`❌ Task #3 not found.`)
    );
  });

  it("does not call saveTasks when task is not found", () => {
    (loadTasks as any).mockReturnValue([]);
    markTaskDone(1);

    expect(saveTasks).not.toHaveBeenCalled();
  });
});
