import fs from "fs";
import path from "path";
import { runCommand } from "../utils/executionHelper.js";
import crypto from "crypto";
import os from "os";

export const runPython = async (code, input = "") => {
  const fileId = crypto.randomUUID();
  const filePath = path.join(os.tmpdir(), `${fileId}.py`);
  
  try {
    fs.writeFileSync(filePath, code);
    const command = `python3 ${filePath}`;
    const output = await runCommand(command, input);
    return output;
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};
