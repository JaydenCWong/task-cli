import { readFileSync, writeFileSync, existsSync} from "fs";

const FILE_PATH = "tasks.json";

export interface Task{
    id: number;
    text: string;
    done: boolean;
}

export function loadTasks(): Task[] {
    if(!existsSync(FILE_PATH)){
        return [];
    }
    const data = readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
}

export function saveTasks(tasks: Task[]): void {
    writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}