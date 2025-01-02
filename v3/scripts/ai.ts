import dotenv from "dotenv";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import path, { join } from "path";
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

const migrateMdx = async (markdownContent: string) => {
	let output = "";

	const completionChunks = await openai.chat.completions.create({
		model: "gpt-4o",
		temperature: 0.1,
		messages: [
			{
				role: "user",
				content: `
`,
			},
			{
				role: "user",
				content: `
        These are the migration rules you must strictly follow:
- Remove all the existing import statements
- Remove all comment blocks
- Replace all headers that use a bracket numbering format with dot notation. Example "# 1) Step" becomes "# 1. Step"
- Replace JSX elements based on the following mapping:

- Remove <details> and <summary> tags but keep the content that's inside them
- Do not change the markdown content that exists inside a jsx element
- Remove the show_ui_switcher property from the frontmatter data (if preset) 
- Add a new property to the frontmatter data called "sidebar_position" and set it to 1
- Don't add or remove links. Do not change any URL.
- Always preserve the original line breaks. Do not add or remove blank lines.
- Based on the jsx elements used add import statements at the top of the file based on the following import example:
- DO NOT include the generated result in an mdx code block. Just return the actual content.
- Only return the MDX content. Don not add any other comments and do not wrap the content in and MDX code block.
- Only return the generated content without wrapping it in backticks.
Extract only the components that are used in the file. 
        `,
			},
			{
				role: "user",
				content: markdownContent,
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
	return output;
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
	return output;
}

const printStatus = (status: string) => {
	process.stdout.write("\x1b[1A\x1b[2K"); // clear previous line
	console.log(status);
};
