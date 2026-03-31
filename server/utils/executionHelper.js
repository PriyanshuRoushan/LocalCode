import { exec } from "child_process";

export function runCommand(command, input = "", timeout = 8000) {
  return new Promise((resolve, reject) => {
    const childProcess = exec(command, { timeout }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr || error.message);
      }
      if (stderr) {
        // Some compilers log warnings to stderr but still succeed. 
        // We'll resolve with stdout. Real errors would have error != null.
        // However, if stdout is empty and stderr is not, it could be an issue.
      }
      resolve(stdout.trim());
    });

    if (input) {
      childProcess.stdin.write(input);
      childProcess.stdin.end();
    }
  });
}
