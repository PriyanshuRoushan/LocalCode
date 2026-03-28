import {app, BrowserWindow , ipcMain} from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './database.js';


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
app.whenReady().then(createWindow);

//Save Progress ✅
ipcMain.handle("save-progress", (_, data) => {
    const stmt = db.prepare(`
            INSERT INTO progress (problemId, status, code, language)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(
            data.problemId,
            data.status,
            data.code,
            data.language
        );

        return { success: true};
});

// Get all Progress ✅
ipcMain.handle("get-progress", () => {
    return db.prepare("SELECT * FROM progress").all();
});
