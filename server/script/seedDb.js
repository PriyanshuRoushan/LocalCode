import fs from "fs";
import db from "../../electron/database.js";

async function seedDatabase() {
  const problemsPath = new URL("problems.json", import.meta.url).pathname;
  const problemsFile = fs.existsSync("problems.json") ? "problems.json" :
                       fs.existsSync(problemsPath) ? problemsPath : null;
  
  if (!problemsFile) {
    console.error("problems.json not found! Please run fetchProblem.js first.");
    return;
  }

  const allProblems = JSON.parse(fs.readFileSync(problemsFile, "utf-8"));

  const insertProblem = db.prepare(
    "INSERT OR REPLACE INTO problems (id, title, description, rating, tags) VALUES (?, ?, ?, ?, ?)"
  );
  
  db.transaction(() => {
    for (const p of allProblems) {
      const id = `${p.contestId}${p.index}`;
      insertProblem.run(id, p.name, "", p.rating || 0, JSON.stringify(p.tags || []));
    }
  })();
  
  console.log(`✅ Successfully seeded ${allProblems.length} problems into localcode.db!`);
}

seedDatabase();
