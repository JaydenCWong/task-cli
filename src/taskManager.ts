import {loadTasks, saveTasks} from "./storage.js";
import type {Task} from "./storage.js";
import chalk from "chalk";


type ConfirmFn = (message: string) => Promise<boolean>;

export async function clearTasks(clearAll:boolean, confirmFn?: ConfirmFn): Promise<void> {
    let tasks = loadTasks();
    if(tasks.length === 0){
        console.log(chalk.cyan("💭 No tasks to clear."));
        return;
    }
    if(clearAll){
        if(confirmFn){
        const userConfirmed = await confirmFn("Are you sure you want to clear ALL tasks?");
        if(!userConfirmed){
            console.log(chalk.red("❌ Cancelled."));
            return;
        }
    }
        tasks.length = 0;
        } else {
            const completedTasks = tasks.filter(task => task.done);
            if(completedTasks.length === 0){
                console.log(chalk.cyan("💭 No completed tasks to clear."));
                return;
            }
            tasks = tasks.filter(task => !task.done);
        }
        saveTasks(tasks);
        console.log(chalk.green(`✅🗑️  Cleared ${clearAll ? "all" : "completed"} tasks.`));
    }


export function addTask(task: string, options: {priority: string}): void {
    let tasks = loadTasks();
        const newTask: Task = {id: Date.now(), text: task, done: false};
        tasks.push(newTask);
        saveTasks(tasks);
        console.log(chalk.green(`✅ Added: "${task}" with priority ${options.priority}`));
    }

export function listTasks(showAll: boolean): void {
    let tasks = loadTasks();
        if(tasks.length === 0){
            console.log(chalk.cyan("💭 No tasks found."));
            return;
        }
        tasks.forEach((task, index) => {
            if(showAll || !task.done){
                console.log(`${index + 1}. [${task.done ? "x" : " "}] ${task.text}`);
            }
        });
    }

export function markTaskDone(id: number): void {
    let tasks = loadTasks();
    const task = tasks.find((_, i)=> i + 1 === id);
        if(task){
            task.done = true;
            saveTasks(tasks);
            console.log(chalk.green(`✅ Marked "${task.text}" as done.`));
        } else {
            console.log(chalk.red(`❌ Task #${id} not found.`));
        }
    }