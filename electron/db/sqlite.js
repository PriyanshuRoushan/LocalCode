import Database from 'better-sqlite3';

const db = new Database('localcode.db');

db.prepare(`
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  problem_id Text,
  code TEXT,
  status TEXT,
  updated_at INTEGER,
  sync_status TEXT
)
`).run();

export default db;