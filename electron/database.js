import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, "../problems_io.db");

const db = new Database(dbPath);

// Progress table (not in problems_io.db by default — create if missing)
db.prepare(`
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY,
    problemId TEXT,
    status TEXT,
    code TEXT,
    language TEXT,
    sync_status TEXT DEFAULT 'pending',
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

try { db.prepare("ALTER TABLE progress ADD COLUMN language TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE progress ADD COLUMN sync_status TEXT DEFAULT 'pending'").run(); } catch (e) {}

export default db;
