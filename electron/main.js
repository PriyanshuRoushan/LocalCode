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
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadURL('http://localhost:5173');
}
app.whenReady().then(() => {
  createWindow();
  startSyncService();
});

//Save Progress ✅
ipcMain.handle("save-progress", (_, data) => {
    const id = crypto.randomUUID();
    const stmt = db.prepare(`
            INSERT INTO progress (id, problemId, status, code, language, sync_status)
            VALUES (?, ?, ?, ?, ?, 'pending')
        `);
        stmt.run(
            id,
            data.problemId,
            data.status,
            data.code,
            data.language
        );

        // trigger immediate sync attempt
        syncData();

        return { success: true, id };
});

ipcMain.on("set-token", (_, token) => {
    setAuthToken(token);
    syncData(); // Attempt immediate sync when token is received
});

// Get all Progress ✅
ipcMain.handle("get-progress", () => {
    return db.prepare("SELECT * FROM progress").all();
});

// ── Question Page IPC Handlers ────────────────────────────────
ipcMain.handle("get-all-problems", () => {
    return db.prepare("SELECT id, title, rating, tags FROM problems ORDER BY rating ASC").all();
});

ipcMain.handle("get-problem", async (_, id) => {
    let problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(id);
    if (!problem) throw new Error("Problem not found");
    
    // On-demand scraping if description is missing
    if (!problem.description || problem.description === '""' || problem.description === "") {
        console.log(`[IPC] Fetching description for ${id} on-demand from Codeforces...`);
        try {
            const { scrapeProblem } = await import('../server/script/scrapeProblem.js');
            const match = id.match(/^(\d+)([A-Z]\d*)$/);
            if (match) {
                const contestId = match[1];
                const index = match[2];
                const data = await scrapeProblem(contestId, index);
                
                // Update problem in DB
                db.prepare("UPDATE problems SET description = ? WHERE id = ?").run(JSON.stringify(data.description), id);
                
                // Insert test cases
                const insertTestCase = db.prepare("INSERT INTO test_cases (problem_id, input, output) VALUES (?, ?, ?)");
                db.transaction(() => {
                    db.prepare("DELETE FROM test_cases WHERE problem_id = ?").run(id);
                    for (const tc of data.testCases) {
                        insertTestCase.run(id, tc.input, tc.output);
                    }
                })();
                
                // Re-fetch problem
                problem = db.prepare("SELECT * FROM problems WHERE id = ?").get(id);
                console.log(`[IPC] Successfully scraped and cached ${id}`);
            }
        } catch (err) {
            console.error("[IPC] On-demand scraping failed:", err);
        }
    }

    // Parse description array back
    if (problem.description) {
        try { problem.description = JSON.parse(problem.description); } 
        catch (_) { problem.description = [problem.description]; }
    }
    if (problem.tags) {
        try { problem.tags = JSON.parse(problem.tags); }
        catch (_) { problem.tags = [problem.tags]; }
    }

    const testCases = db.prepare("SELECT * FROM test_cases WHERE problem_id = ? LIMIT 2").all(id);
    problem.examples = testCases.map(tc => ({
        input: tc.input,
        output: tc.output,
        explanation: ""
    }));

    return problem;
});

ipcMain.handle("run-code", async (_, { problemId, language, code, testInput }) => {
    const start = performance.now();
    let stdout = "";
    try {
        if (language === "cpp") stdout = await runCpp(code, testInput);
        else if (language === "python") stdout = await runPython(code, testInput);
        else if (language === "java") stdout = await runJava(code, testInput);
        else throw new Error("Unsupported language");
        
        const time = Math.round(performance.now() - start);
        return { stdout, stderr: "", time };
    } catch (err) {
        return { stdout: "", stderr: err.toString(), time: null };
    }
});

ipcMain.handle("submit-code", async (_, { problemId, language, code }) => {
    const testCases = db.prepare("SELECT * FROM test_cases WHERE problem_id = ?").all(problemId);
    if (!testCases || testCases.length === 0) {
        return { verdict: "System Error", stderr: "No test cases found in local SQLite database for this problem." };
    }

    let passedCases = 0;
    const totalCases = testCases.length;
    let totalTime = 0;

    for (const tc of testCases) {
        const start = performance.now();
        let out = "";
        try {
            if (language === "cpp") out = await runCpp(code, tc.input);
            else if (language === "python") out = await runPython(code, tc.input);
            else if (language === "java") out = await runJava(code, tc.input);
            
            totalTime += Math.round(performance.now() - start);
            
            // Clean outputs (trim whitespace)
            const actual = out.trim();
            const expected = tc.output.trim();
            
            if (actual === expected) {
                passedCases++;
            } else {
                return { 
                    verdict: "Wrong Answer", 
                    passedCases, 
                    totalCases, 
                    stdout: `Expected: \n${expected}\n\nOutput: \n${actual}`,
                    runtime: `${totalTime} ms`
                };
            }
        } catch (err) {
            return { verdict: "Runtime Error", stderr: err.toString(), passedCases, totalCases };
        }
    }

    // Save accepted progress
    const attemptId = crypto.randomUUID();
    db.prepare(`
        INSERT INTO progress (id, problemId, status, code, language, sync_status)
        VALUES (?, ?, 'accepted', ?, ?, 'pending')
    `).run(attemptId, problemId, code, language);
    syncData(); // background sync

    return {
        verdict: "Accepted",
        passedCases,
        totalCases,
        runtime: `${totalTime} ms`,
        memory: "14.2 MB", // Mocked memory for now
        stdout: "All test cases passed!"
    };
});
