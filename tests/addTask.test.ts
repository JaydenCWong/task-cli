import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addTask} from '../src/taskManager.js';
import * as storage from '../src/storage.js';

vi.mock("../src/storage.js", () => {
    return{
        loadTasks: vi.fn(() => []),
        saveTasks: vi.fn(),
    };
});

describe('addTask', () => {
    const mockedStorage = vi.mocked(storage, true)

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("adds a task and saves it", () =>{
        addTask("Do the dishes", {priority: "high"});

        expect(mockedStorage.saveTasks).toHaveBeenCalledTimes(1);
        const savedTasks = mockedStorage.saveTasks.mock.calls[0][0];

        expect(savedTasks).toHaveLength(1);
        expect(savedTasks[0].text).toBe("Do the dishes");
        expect(savedTasks[0].done).toBe(false);
    });
});