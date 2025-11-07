import readLine from "readline";

export function confirm(message: string): Promise<boolean> {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve)=>{
        rl.question(`${message} (y/n): `, (answer) => {
            rl.close();
            const normalized = answer.trim().toLowerCase();
            resolve(normalized === "y" || normalized === "yes");
        });
    })
}