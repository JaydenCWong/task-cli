import { describe, it, expect, vi, beforeEach } from "vitest";
import { clearTasks } from "../src/taskManager.js";
import * as storage from "../src/storage.js";
import * as utils from "../src/utils.js";

vi.mock("../src/storage.js", () => {
  return {
    loadTasks: vi.fn(),
    saveTasks: vi.fn(),
  };
});

vi.mock("../src/utils.js", () => {
  return {
    confirm: vi.fn(),
  };
});

describe("clearTasks", () => {
  const mockedStorage = vi.mocked(storage, true);
  const mockedUtils = vi.mocked(utils, true);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("clears completed tasks only (default mode)", async () => {
    mockedStorage.loadTasks.mockReturnValue([
      { id: 1, text: "Task 1", done: true },
      { id: 2, text: "Task 2", done: false },
    ]);
    await clearTasks(false);

    expect(mockedStorage.saveTasks).toHaveBeenCalledWith([
      { id: 2, text: "Task 2", done: false },
    ]);
  });

  it("confirms before clearing all tasks", async () => {
    mockedStorage.loadTasks.mockReturnValue([
      { id: 1, text: "Task 1", done: true },
      { id: 2, text: "Task 2", done: false },
    ]);
    mockedUtils.confirm.mockResolvedValue(true);

    await clearTasks(true, mockedUtils.confirm);

    expect(mockedUtils.confirm).toHaveBeenCalledWith(
      "Are you sure you want to clear ALL tasks?"
    );
    expect(mockedStorage.saveTasks).toHaveBeenCalledWith([]);
  });

  it("cancels clearing all tasks if user says no", async () => {
    mockedStorage.loadTasks.mockReturnValue([
      { id: 1, text: "Task 1", done: true },
      { id: 2, text: "Task 2", done: false },
    ]);

    mockedUtils.confirm.mockResolvedValue(false);

    await clearTasks(true, mockedUtils.confirm);

    expect(mockedUtils.confirm).toHaveBeenCalledWith(
      "Are you sure you want to clear ALL tasks?"
    );
    expect(mockedStorage.saveTasks).not.toHaveBeenCalled();
  });

  it("handles empty task list gracefully", async () => {
    mockedStorage.loadTasks.mockReturnValue([]);

    await clearTasks(false);

    expect(mockedStorage.saveTasks).not.toHaveBeenCalled();
  });
});
