import fs from "fs";
import path from "path";
import { runCommand } from "../utils/executionHelper.js";
import crypto from "crypto";
import os from "os";

export const runJava = async (code, input = "") => {
  // Java requires the file name to match the public class name.
  // We'll regex search for 'public class X' or default to 'Main'.
  const classNameMatch = code.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  const className = classNameMatch ? classNameMatch[1] : "Main";
  
  const dirId = crypto.randomUUID();
  const dirPath = path.join(os.tmpdir(), dirId);
  fs.mkdirSync(dirPath, { recursive: true });
  
  const filePath = path.join(dirPath, `${className}.java`);
  
  try {
    fs.writeFileSync(filePath, code);
    // Compile
    await runCommand(`javac ${filePath}`);
    // Run inside the isolated directory
    const output = await runCommand(`java -cp ${dirPath} ${className}`, input);
    return output;
  } finally {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
};
