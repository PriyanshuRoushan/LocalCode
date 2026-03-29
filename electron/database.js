import Database from "better-sqlite3";

const db = new Database("localcode.db");

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

// Safely attempt to add new columns to existing tables (ignoring errors if they already exist)
try { db.prepare("ALTER TABLE progress ADD COLUMN language TEXT").run(); } catch (e) {}
try { db.prepare("ALTER TABLE progress ADD COLUMN sync_status TEXT DEFAULT 'pending'").run(); } catch (e) {}
// Note: We cannot easily modify INTEGER PRIMARY KEY to TEXT, but SQLite's dynamic 
// typing allows inserting UUID text into INTEGER columns in some cases. Ideally, new setups
// will just get the TEXT column.


export default db;
