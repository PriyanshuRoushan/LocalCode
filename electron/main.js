import {app, BrowserWindow , ipcMain} from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './database.js';
import crypto from 'crypto';
import { startSyncService, syncData, setAuthToken } from './syncService.js';
import { runPython } from '../server/runner/pythonRunner.js';
import { runCpp } from '../server/runner/cppRunner.js';
import { runJava } from '../server/runner/javaRunner.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadURL('http://localhost:5173');
}
app.whenReady().then(() => {
  createWindow();
  startSyncService();
});

// Save Progress ✅
ipcMain.handle("save-progress", (_, data) => {
    const id = crypto.randomUUID();
    db.prepare(`
        INSERT INTO progress (id, problemId, status, code, language, sync_status)
        VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(id, data.problemId, data.status, data.code, data.language);
    syncData();
    return { success: true, id };
});

ipcMain.on("set-token", (_, token) => {
    setAuthToken(token);
    syncData();
});

// Get all Progress ✅
ipcMain.handle("get-progress", () => {
    return db.prepare("SELECT * FROM progress").all();
});

// ── Get all problems — uses problems_io.db schema ─────────────
ipcMain.handle("get-all-problems", () => {
    const rows = db.prepare(
        "SELECT id, title, rating, tags, time_limit, memory_limit FROM problems ORDER BY rating ASC"
    ).all();

    return rows.map(p => ({
        ...p,
        // tags are comma-separated strings in problems_io.db
        tags: p.tags ? p.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
    }));
});

// ── Get single problem ────────────────────────────────────────
ipcMain.handle("get-problem", async (_, id) => {
    let problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(id);
    if (!problem) throw new Error("Problem not found");

    // On-demand scraping if description is missing
    if (!problem.description || problem.description === "") {
        console.log(`[IPC] Fetching ${id} on-demand from Codeforces...`);
        try {
            const { scrapeProblem } = await import('../server/script/scrapeProblem.js');
            const match = id.match(/^(\d+)([A-Z]\d*)$/);
            if (match) {
                const data = await scrapeProblem(match[1], match[2]);

                db.prepare(`
                    UPDATE problems
                    SET description = ?, input_format = ?, output_format = ?, note = ?
                    WHERE id = ?
                `).run(
                    JSON.stringify(data.description),
                    data.inputFormat ?? "",
                    data.outputFormat ?? "",
                    data.note ?? "",
                    id
                );

                const insertTC = db.prepare(
                    "INSERT INTO test_cases (problem_id, input, output, case_number) VALUES (?, ?, ?, ?)"
                );
                db.transaction(() => {
                    db.prepare("DELETE FROM test_cases WHERE problem_id = ?").run(id);
                    data.testCases.forEach((tc, i) => insertTC.run(id, tc.input, tc.output, i + 1));
                })();

                problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(id);
                console.log(`[IPC] Scraped and cached ${id}`);
            }
        } catch (err) {
            console.error("[IPC] On-demand scraping failed:", err);
        }
    }

    // Parse description
    if (problem.description) {
        try { problem.description = JSON.parse(problem.description); }
        catch (_) { problem.description = [problem.description]; }
    } else {
        problem.description = [];
    }

    // Parse tags (comma-separated)
    problem.tags = problem.tags
        ? problem.tags.split(",").map(t => t.trim()).filter(Boolean)
        : [];

    // Attach examples from test_cases
    const testCases = db.prepare(
        "SELECT * FROM test_cases WHERE problem_id = ? ORDER BY case_number ASC LIMIT 3"
    ).all(id);
    problem.examples = testCases.map(tc => ({
        input: tc.input,
        output: tc.output,
        explanation: "",
    }));

    return problem;
});

ipcMain.handle("run-code", async (_, { problemId, language, code, testInput }) => {
    const start = performance.now();
    try {
        let stdout = "";
        if (language === "cpp") stdout = await runCpp(code, testInput);
        else if (language === "python") stdout = await runPython(code, testInput);
        else if (language === "java") stdout = await runJava(code, testInput);
        else throw new Error("Unsupported language");
        return { stdout, stderr: "", time: Math.round(performance.now() - start) };
    } catch (err) {
        return { stdout: "", stderr: err.toString(), time: null };
    }
});

ipcMain.handle("submit-code", async (_, { problemId, language, code }) => {
    const testCases = db.prepare("SELECT * FROM test_cases WHERE problem_id = ?").all(problemId);
    if (!testCases || testCases.length === 0) {
        return { verdict: "System Error", stderr: "No test cases found for this problem." };
    }

    let passedCases = 0;
    const totalCases = testCases.length;
    let totalTime = 0;

    for (const tc of testCases) {
        const start = performance.now();
        try {
            let out = "";
            if (language === "cpp") out = await runCpp(code, tc.input);
            else if (language === "python") out = await runPython(code, tc.input);
            else if (language === "java") out = await runJava(code, tc.input);

            totalTime += Math.round(performance.now() - start);
            if (out.trim() !== tc.output.trim()) {
                return {
                    verdict: "Wrong Answer",
                    passedCases,
                    totalCases,
                    stdout: `Expected:\n${tc.output.trim()}\n\nGot:\n${out.trim()}`,
                    runtime: `${totalTime} ms`,
                };
            }
            passedCases++;
        } catch (err) {
            return { verdict: "Runtime Error", stderr: err.toString(), passedCases, totalCases };
        }
    }

    const attemptId = crypto.randomUUID();
    db.prepare(`
        INSERT INTO progress (id, problemId, status, code, language, sync_status)
        VALUES (?, ?, 'accepted', ?, ?, 'pending')
    `).run(attemptId, problemId, code, language);
    syncData();

    return {
        verdict: "Accepted",
        passedCases,
        totalCases,
        runtime: `${totalTime} ms`,
        memory: "14.2 MB",
        stdout: "All test cases passed!",
    };
});
