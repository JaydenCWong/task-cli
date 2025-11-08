import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { listTasks } from "../src/taskManager.js";
import { loadTasks } from "../src/storage.js";
import type { Task } from "../src/storage.js";

vi.mock("../src/storage.js", () => ({
  loadTasks: vi.fn(),
  saveTasks: vi.fn(),
}));

describe("listTasks", () => {
  let mockConsoleLog: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should print all tasks when showAll is true", () => {
    const tasks: Task[] = [
      { id: 1, text: "Task 1", done: false },
      { id: 2, text: "Task 2", done: true },
    ];
    (loadTasks as any).mockReturnValue(tasks);

    listTasks(true);

    expect(mockConsoleLog).toHaveBeenCalledWith("1. [ ] Task 1");
    expect(mockConsoleLog).toHaveBeenCalledWith("2. [x] Task 2");
  });

  it("should print only incomplete tasks when showAll is false", () => {
    const tasks: Task[] = [
      { id: 1, text: "Task 1", done: false },
      { id: 2, text: "Task 2", done: true },
    ];
    (loadTasks as any).mockReturnValue(tasks);

    listTasks(false);

    expect(mockConsoleLog).toHaveBeenCalledWith("1. [ ] Task 1");
    expect(mockConsoleLog).not.toHaveBeenCalledWith("2. [x] Task 2");
  });

  it("should print nothing if there are no tasks", () => {
    (loadTasks as any).mockReturnValue([]);

    listTasks(true);

    expect(mockConsoleLog).toHaveBeenCalledWith("💭 No tasks found.");
  });

  it("should keep original numbering when skipping completed tasks", () => {
    const tasks: Task[] = [
      { id: 1, text: "Task 1", done: false },
      { id: 2, text: "Task 2", done: true },
      { id: 3, text: "Task 3", done: false },
    ];
    (loadTasks as any).mockReturnValue(tasks);

    listTasks(false);

    // Should skip Task 2 entirely but preserve the original indices (1 and 3)
    expect(mockConsoleLog).toHaveBeenCalledWith("1. [ ] Task 1");
    expect(mockConsoleLog).toHaveBeenCalledWith("3. [ ] Task 3");
    expect(mockConsoleLog).not.toHaveBeenCalledWith("2. [x] Task 2");
  });
});
