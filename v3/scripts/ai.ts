import dotenv from "dotenv";
import fs from "fs";
import matter from "gray-matter";
import { readFile, writeFile } from "fs/promises";
import { $, Glob, file, write } from "bun";
import ora from "ora";
import path, { join } from "path";
import { exec } from "child_process";
import OpenAI from "openai";

/**
 * A series of helper functions that makes use of the
 * OpenAI API to automate common tasks (migrating documentation, generating new data, etc)
 *
 * Use the existing code as a reference on how to implement additional helpers
 */

dotenv.config({ path: join(__dirname, ".env") });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const seoInfo = async (markdownContent: string) => {
  let output = "";

  const completionChunks = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    messages: [
      {
        role: "user",
        content: `
  You are working on a documentation project that uses Docusaurus and vale.sh for linting.
  You are tasked with fixing the linting errors in the provided markdown content.
`,
      },
      {
        role: "user",
        content: `
        You will receive a document and the linting errors associated with it.
        The document represents an MDX page from the documentation project
        Return an updated document that has the linting errors fixed.
        Read the document and return and a string that will act as a SEO description for the document
        - Keep the description short. At most 15 words
        - Be concise
        - Do not use redundant phrasing like "This page does X". Just explain what it does
        - Only explain the main idea of the page
        - Use an active writing style. Explain what the user will be able to do by reading this page.
        - Do not use adjectives like seamless, easy, fast or any kind of marketing speak.
        You will return only the string. No other details besides that. 
        `,
      },
      {
        role: "user",
        content: markdownContent,
      },
    ],
    stream: true,
  });
  const spinner = ora("Receiving GPT message").start();
  let chunkIndex = 0;
  for await (const chunk of completionChunks) {
    chunkIndex++;
    spinner.text = `Received chunk ${chunkIndex}`;
    const stringChunk = chunk.choices[0]?.delta?.content || "";
    output += stringChunk;
  }
  spinner.succeed("Received GPT message");

  return output;
};

const correctLinting = async (lintingIssues: ValeLintingIssue[]) => {
  let output = "";

  const completionChunks = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    messages: [
      {
        role: "developer",
        content: `
  You are working on a documentation project that uses Docusaurus and vale.sh for linting.
  You are tasked with fixing the linting issues from an MDX document.
`,
      },
      {
        role: "developer",
        content: `
        You will receive a json encoded string with linting issues associated with it.
        The JSON has the following format:
        [{ 
           // the error message from vale.sh 
           ErrorMessage: string,
           // the line of the MDX document that contains the issue
           Value: string,
           // the line number
           Line: number
        }]
        Return the corrected lines in the same format as the input but with the Value property updated with the corrected line.
        Only return the response array. Do not change the order of the array. It should be the same as the original array.
        Respect the following rules when formulating the response:
        - Only correct the vale errors. Do not include any additional information.
        - Do not wrap the response in "\`\`\`markdown" backticks
        - Do not wrap the response in "\`\`\`json" backticks
        - Return the same amount of array elements as the input. Match the array elements by their index.
        - If you do not know how to correct a line, return the original line.
        - Do not change import statements
        - Do not change values inside inline code expressions (single backticks: \`appInfo\`). Ignore errors for this type of expressions.
        - Values that look like variable names should be wrapped in backticks (\`appInfo\`)
        - If you encounter "signup" or "signin" errors, replace the words with "sign up" or "sign in"
        - If you encounter "supertokens" errors, replace the words with "SuperTokens"
        - If you encounter "Github" errors, replace the words with "GitHub"
        - If you encounter "env var(s)" expressions, replace the words with "environment variable(s)"
        - If you encounter "uri", "url", "api" expressions, replace the words with "URL", "URI", "API"
        - If you encounter the following expression, "env vars", replace it with "environment variables"
        - If you encounter errors for the following words: appId, env, just wrap the words in backticks (\`appId\`)
        `,
      },
      {
        role: "user",
        content: `${JSON.stringify(lintingIssues.map((lintingIssue) => ({ ErrorMessage: lintingIssue.Message, Value: lintingIssue.IncorrectValue, Line: lintingIssue.Line })))}`,
      },
    ],
    stream: true,
  });
  let chunkIndex = 0;
  const spinner = ora("Receiving GPT message").start();
  for await (const chunk of completionChunks) {
    chunkIndex++;
    spinner.text = `Received chunk ${chunkIndex}`;
    const stringChunk = chunk.choices[0]?.delta?.content || "";
    output += stringChunk;
  }
  spinner.succeed("Received GPT message");

  const parsedResult = JSON.parse(output) as { ErrorMessage: string; Value: string; Line: number }[];
  return lintingIssues.map((lintingIssue, index) => {
    if (parsedResult[index].Line !== lintingIssue.Line) {
      throw new Error(
        `Line mismatch for ${lintingIssue.Line}. Expected ${parsedResult[index].Line} but got ${lintingIssue.Line}`,
      );
    }
    const correctedLine = parsedResult[index].Value;
    lintingIssue.CorrectValue = correctedLine;
  });
};

async function createRedirectMap(oldUrls: string, newUrls: string) {
  let output = "";

  const completionChunks = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.1,
    messages: [
      {
        role: "user",
        content: `
You will receive two list of urls. The first one represents old links from a previous version of a website. The second one represents the new urls.
Processe the two lists and then create a mapping list that will be used to redirect the old urls to the new ones.
The format of the new list should be:
Array<{ from: string, to: string }>
The result final result should include mappings for ALL the links mentioned in the old list. 
Make sure that all the links from the old list have a mapping.
`,
      },
      {
        role: "user",
        content: `
The old links:
${oldUrls}
        `,
      },
      {
        role: "user",
        content: `
The new links:
${newUrls}
        `,
      },
    ],
    stream: true,
  });
  console.log(`Parsing gpt completion`);
  let chunkIndex = 0;
  for await (const chunk of completionChunks) {
    chunkIndex++;
    const stringChunk = chunk.choices[0]?.delta?.content || "";
    printStatus(`Received chunk ${chunkIndex}`);
    output += stringChunk;
  }
  console.log(output);

  return output;
}

const printStatus = (status: string) => {
  process.stdout.write("\x1b[1A\x1b[2K"); // clear previous line
  console.log(status);
};

(async () => {
  const startPath = "./docs/authentication/enterprise";
  const valeReport = await runVale(startPath);

  for (const file in valeReport) {
    console.log(`Processing ${file}`);
    const lintingIssues = valeReport[file];
    await readLinesWithLintingIssues(file, lintingIssues);
    await correctLinting(lintingIssues);
    await writeLintingCorrectionsToFile(file, lintingIssues);
  }
})();

async function listFiles(startPath: string) {
  const files: string[] = [];
  const glob = new Glob("**/*.mdx");

  for await (const file of glob.scan(startPath)) {
    files.push(file);
  }
  return files;
}

async function readLinesWithLintingIssues(filePath: string, lintingIssues: ValeLintingIssue[]) {
  const fileContent = await file(filePath).text();
  const fileLines = fileContent.split("\n");
  for (const lintingIssue of lintingIssues) {
    const lineContent = fileLines[lintingIssue.Line - 1];
    if (!lineContent) {
      throw new Error(`Line ${lintingIssue.Line} not found in file ${filePath}`);
    }
    lintingIssue.IncorrectValue = lineContent;
  }
}

async function writeLintingCorrectionsToFile(filePath: string, lintingIssues: ValeLintingIssue[]) {
  const fileContent = await file(filePath).text();
  const fileLines = fileContent.split("\n");
  for (const lintingIssue of lintingIssues) {
    const lineContent = fileLines[lintingIssue.Line - 1];
    if (!lineContent) {
      throw new Error(`Line ${lintingIssue.Line} not found in file ${filePath}`);
    }
    fileLines[lintingIssue.Line - 1] = lintingIssue.CorrectValue;
  }
  await write(filePath, fileLines.join("\n"));
}

async function runVale(itemPath: string): Promise<ValeReport> {
  const { stdout } = await $`vale ${itemPath}  --output=JSON --no-exit`.nothrow();
  const parsedReport = JSON.parse(stdout.toString());
  return parsedReport as ValeReport;
}

interface ValeLintingIssue {
  Span: [number, number];
  Check: string;
  Description: string;
  Severity: "error" | "warning" | "suggestion";
  Line: number;
  Message: string;
  Match: string;
  // Custom props used for persisting differnt values
  IncorrectValue: string;
  CorrectValue: string;
}

interface ValeReport {
  [key: string]: Array<ValeLintingIssue>;
}
