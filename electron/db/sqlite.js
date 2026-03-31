import Database from 'better-sqlite3';

const db = new Database('localcode.db');

//
// 🧾 SUBMISSIONS TABLE (already yours)
//
db.prepare(`
CREATE TABLE IF NOT EXISTS submissions (
  id TEXT PRIMARY KEY,
  problem_id TEXT,
  code TEXT,
  status TEXT,
  updated_at INTEGER,
  sync_status TEXT
)
`).run();

//
// 📘 PROBLEMS TABLE (ADD THIS)
//
db.prepare(`
CREATE TABLE IF NOT EXISTS problems (
  id TEXT PRIMARY KEY,
  title TEXT,
  description TEXT,
  rating INTEGER,
  tags TEXT
)
`).run();

//
// 🧪 TEST CASES TABLE (ADD THIS)
//
db.prepare(`
CREATE TABLE IF NOT EXISTS test_cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  problem_id TEXT,
  input TEXT,
  output TEXT,
  FOREIGN KEY(problem_id) REFERENCES problems(id)
)
`).run();

export default db;
