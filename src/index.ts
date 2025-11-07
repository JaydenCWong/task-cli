#!/usr/bin/env node

import {loadTasks, saveTasks} from "./storage.js";
import type {Task} from "./storage.js";
import {Command} from "commander";

const program = new Command();
let tasks = loadTasks();
program
    .name("task-cli")
    .version("1.0.0)")
    .description("A simple CLI task manager");

program
    .command("add <task>")
    .description("Add a new task")
    .option("-p, --priority <level>", "Set task priority", "normal")
    .action((task: string, options: {priority: string}) => {
        addTask(task, options);
    });

program
    .command("list")
    .description("List tasks")
    .option("-a, --all", "Show all tasks")
    .action((options) =>{
        listTasks(options.all);
    });
program
    .command("done <id>")
    .description("Mark a task as done")
    .action((id)=> {
        markTaskDone(Number(id));});


function addTask(task: string, options: {priority: string}): void {
        const newTask: Task = {id: Date.now(), text: task, done: false};
        tasks.push(newTask);
        saveTasks(tasks);
        console.log(`✅ Added: "${task}" with priority ${options.priority}`);
    }

function listTasks(showAll: boolean): void {
        tasks.forEach((task, index) => {
            if(showAll || !task.done){
                console.log(`${index + 1}. [${task.done ? "x" : " "}] ${task.text}`);
            }
        });
    }

function markTaskDone(id: number): void {
    const task = tasks.find((_, i)=> i + 1 === id);
        if(task){
            task.done = true;
            saveTasks(tasks);
            console.log(`✅ Marked "${task.text}" as done.`);
        } else {
            console.log(`❌ Task #${id} not found.`);
        }
    }
program.parse(process.argv);