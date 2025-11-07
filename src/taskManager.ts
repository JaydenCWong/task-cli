import {loadTasks, saveTasks} from "./storage.js";
import type {Task} from "./storage.js";
import {confirm} from "./utils.js";

let tasks = loadTasks();

export async function clearTasks(clearAll:boolean): Promise<void> {
    if(tasks.length === 0){
        console.log("💭 No tasks to clear.");
        return;
    }
    if(clearAll){
        const userConfirmed = await confirm("Are you sure you want to clear ALL tasks?");
        if(!userConfirmed){
            console.log("❌ Cancelled.");
            return;
        }
        tasks.length = 0;
        } else {
            const completedTasks = tasks.filter(task => task.done);
            if(completedTasks.length === 0){
                console.log("💭 No completed tasks to clear.");
                return;
            }
            tasks = tasks.filter(task => !task.done);
        }
        saveTasks(tasks);
        console.log(`✅🗑️  Cleared ${clearAll ? "all" : "completed"} tasks.`);
    }


export function addTask(task: string, options: {priority: string}): void {
        const newTask: Task = {id: Date.now(), text: task, done: false};
        tasks.push(newTask);
        saveTasks(tasks);
        console.log(`✅ Added: "${task}" with priority ${options.priority}`);
    }

export function listTasks(showAll: boolean): void {
        tasks.forEach((task, index) => {
            if(showAll || !task.done){
                console.log(`${index + 1}. [${task.done ? "x" : " "}] ${task.text}`);
            }
        });
    }

export function markTaskDone(id: number): void {
    const task = tasks.find((_, i)=> i + 1 === id);
        if(task){
            task.done = true;
            saveTasks(tasks);
            console.log(`✅ Marked "${task.text}" as done.`);
        } else {
            console.log(`❌ Task #${id} not found.`);
        }
    }