import fs from "fs";
import { scrapeProblem } from "./scrapeProblem.js";

async function buildDataset() {
  const problems = JSON.parse(fs.readFileSync("problems.json"));

  const dataset = [];

  for (let i = 0; i < 20; i++) { // limit for testing
    const p = problems[i];

    try {
      const data = await scrapeProblem(p.contestId, p.index);

      dataset.push({
        ...p,
        description: data.description,
        testCases: data.testCases,
      });

      console.log(`Fetched ${p.name}`);
    } catch (err) {
      console.log(`Failed ${p.name}`);
    }
  }

  fs.writeFileSync("dataset.json", JSON.stringify(dataset, null, 2));
}

buildDataset();