import {app, BrowserWindow , ipcMain} from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './database.js';
import crypto from 'crypto';
import { startSyncService, syncData, setAuthToken } from './syncService.js';


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
