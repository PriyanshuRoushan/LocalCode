import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: '../.env' }); // Adjust path since script is in server/script/

async function fetchProblems() {
  const res = await axios.get(
    process.env.CODEFORCES_API_URL
  );

  const problems = res.data.result.problems;

  const formatted = problems.map((p) => ({
    contestId: p.contestId,
    index: p.index,
    name: p.name,
    rating: p.rating || 0,
    tags: p.tags,
  }));

  fs.writeFileSync("problems.json", JSON.stringify(formatted, null, 2));

  console.log("Problems saved!");
}

fetchProblems();