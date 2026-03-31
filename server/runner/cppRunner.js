import fs from "fs";
import path from "path";
import { runCommand } from "../utils/executionHelper.js";
import crypto from "crypto";
import os from "os";

export const runCpp = async (code, input = "") => {
  const fileId = crypto.randomUUID();
  const filePath = path.join(os.tmpdir(), `${fileId}.cpp`);
  const outPath = path.join(os.tmpdir(), `${fileId}.out`);
  
  try {
    fs.writeFileSync(filePath, code);
    // Compile
    await runCommand(`g++ ${filePath} -o ${outPath}`);
    // Execute
    const output = await runCommand(outPath, input);
    return output;
  } finally {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
  }
};
