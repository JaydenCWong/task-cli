#!/usr/bin/env node

import {addTask, listTasks, markTaskDone, clearTasks} from "./taskManager.js";
import {Command} from "commander";
import { interactiveCLI } from "./inquiry.js";
import { confirm } from "./utils.js";


const program = new Command();

program
    .name("task-cli")
    .version("1.0.0)")
    .description("A simple CLI task manager");

program
    .command("add <task>")
    .description("Add a new task")
    .alias("a")
    .option("-p, --priority <level>", "Set task priority", "normal")
    .action((task: string, options: {priority: string}) => {
        addTask(task, options);
    });

program
    .command("list")
    .description("List tasks")
    .alias("ls")
    .option("-a, --all", "Show all tasks")
    .action((options) =>{
        listTasks(options.all);
    });
program
    .command("done <id>")
    .description("Mark a task as done")
    .alias("d")
    .action((id)=> {
        markTaskDone(Number(id));});

program
    .command("clear")
    .description("Clear tasks, by default clears completed tasks only")
    .alias("c")
    .alias("rm")
    .option("-a, --all", "Clear all tasks")
    .action(async (options) => {
        await clearTasks(options.all, confirm);
    });

program
    .command("interactive")
    .description("Start interactive CLI")
    .action(async () => {
        await interactiveCLI();
    });
program.parse(process.argv);