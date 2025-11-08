import inquirer from "inquirer";
import { clearTasks, listTasks, markTaskDone, addTask } from "./taskManager.js";
import { loadTasks } from "./storage.js";

export async function interactiveCLI() {
  let exit = false;

  while (!exit) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: [
          { name: "Add Task", value: "add" },
          { name: "List Tasks", value: "list" },
          { name: "Mark Task as Done", value: "done" },
          { name: "Clear Tasks", value: "clear" },
          { name: "Exit", value: "exit" },
        ],
      },
    ]);
    switch (action) {
      case "add": {
        const { taskText, priority } = await inquirer.prompt([
          {
            type: "input",
            name: "taskText",
            message: "Enter task description:",
          },
          {
            type: "list",
            name: "priority",
            message: "Select task priority:",
            choices: ["low", "medium", "high"],
            default: "medium",
          },
        ]);
        addTask(taskText, { priority });
        break;
      }
      case "list": {
        const { showAll } = await inquirer.prompt([
          {
            type: "confirm",
            name: "showAll",
            message: "Show compelted tasks as well?",
            default: false,
          },
        ]);
        listTasks(showAll);
        break;
      }
      case "done": {
        const tasks = loadTasks();
        const pendingTasks = tasks
          .map((task, index) => ({ name: task.text, value: index + 1 }))
          .filter((_, i) => !tasks[i]?.done);

        if (pendingTasks.length === 0) {
          console.log("💭 No pending tasks to mark as done.");
          break;
        }

        const { id } = await inquirer.prompt([
          {
            type: "list",
            name: "id",
            message: "Select a task to mark as done:",
            choices: pendingTasks,
          },
        ]);

        markTaskDone(id);
        break;
      }
      case "clear":{
        const { clearAll } = await inquirer.prompt([
            {
                type: "confirm",
                name: "clearAll",
                message: "Clear all tasks (including completed)?",
                default: false,
            },
        ]);
        await clearTasks(clearAll);
        break;
      }
      case "exit":
        exit = true;
        console.log("👋 Goodbye!");
        break;
    }
  }
}
