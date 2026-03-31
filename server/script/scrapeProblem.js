import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

export async function scrapeProblem(contestId, index) {
  const url = process.env.CODEFORCES_URL + contestId + "/" + index;
  const { data } = await axios.get(url);

  const $ = cheerio.load(data);

  const title = $(".problem-statement .title").text().trim();

  const description = $(".problem-statement")
    .find("div")
    .first()
    .text()
    .trim();

  const inputs = [];
  const outputs = [];

  $(".input pre").each((i, el) => {
    inputs.push($(el).text().trim());
  });

  $(".output pre").each((i, el) => {
    outputs.push($(el).text().trim());
  });

  const testCases = inputs.map((input, i) => ({
    input,
    output: outputs[i],
  }));

  return {
    contestId,
    index,
    title,
    description,
    testCases,
  };
}