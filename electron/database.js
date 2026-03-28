import Database from "better-sqlite3";

const db = new Database("localcode.db");

db.prepare(`
    CREATE TABLE IF NOT EXISTS progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    problemId TEXT,
    status TEXT,
    code TEXT,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

export default db;
