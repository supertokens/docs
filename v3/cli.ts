import algoliasearch from "algoliasearch";
import { Command } from "commander";
import dotenv from "dotenv";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import OpenAI from "openai";
import path, { join } from "path";

dotenv.config({ path: join(__dirname, ".env") });

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});
const program = new Command();

const migrateFile = async (sourcePath: string, destinationPath: string) => {
	console.log(`Migrating ${sourcePath}`);
	const markdownContent = await readFile(sourcePath);
	const output = await migrateMdx(markdownContent.toString());
	const fileName = path.basename(sourcePath);
	const destinationFilePath = path.join(destinationPath, fileName);
	await writeFile(destinationFilePath, output);
};

(async () => {
	program
		.name("Migrate Page")
		.command("migrate")
		.arguments("<source>")
		.arguments("<destination>")
		.action(async (sourcePath: string, destinationPath: string) => {
			if (!fs.existsSync(destinationPath)) {
				fs.mkdirSync(destinationPath);
			}
			if (!fs.statSync(destinationPath).isDirectory()) {
				throw new Error("Destination path must be a directory");
			}
			const isDirectory = fs.statSync(sourcePath).isDirectory();
			const filesToMigrate: string[] = [];
			if (isDirectory) {
				filesToMigrate.push(...listFiles(sourcePath));
			} else {
				filesToMigrate.push(sourcePath);
			}

			for (const filePath of filesToMigrate) {
				await migrateFile(filePath, destinationPath);
			}
		});

	try {
		await program.parseAsync(process.argv);
		console.log("All good");
	} catch (e) {
		console.error("Command Error");
		console.error(e);
	}
})();

const migrateMdx = async (markdownContent: string) => {
	let output = "";

	const completionChunks = await openai.chat.completions.create({
		model: "gpt-4o",
		temperature: 0.1,
		messages: [
			{
				role: "user",
				content:
					"Your task is to process the following MDX content based on a set of rules.",
			},
			{
				role: "user",
				content: `
        These are the migration rules you must strictly follow:
- Remove all the existing import statements
- Remove all comment blocks
- Replace all headers that use a bracket numbering format with dot notation. Example "# 1) Step" becomes "# 1. Step"
- Replace JSX elements based on the following mapping:
  - BackendSDKTabs -> BackendTabs
     - Replace the usage of TabItem inside the BackendSDKTabs with BackendTab.Tab
     - Replace enableCurl and enableDashboard with the following prop additionalValues={[{label: "Curl", value: "curl"}, {label: "Dashboard", value: "dashboard"}]} 
  - AppInfoForm -> AppInfoForm 
     - Keep only the first usage and write it as a self closing component
     - Remove the other occurences
  - PreBuiltOrCustomUISwitcher -> UIType.Switch
     - Use it as a self closing component
  - PreBuiltUIContent -> UIType.PrebuiltUIContent
  - CustomUIContent -> UIType.CustomUIContent
  - NpmOrScriptTabs -> NpmOrScriptsCard
     - Replace the usage of TabItem inside the NpmOrScriptTab with NpmOrScriptsCard.Content
  - FrontendMobileSubTabs -> MobileFrameworksCard
     - Replace the usage of TabItem inside the FrontendMobileSubTabs with MobileFrameworksCard.Content
  - FrontendPreBuiltUITabs -> FrontendTabs
     - Replace the usage of TabItem inside the FrontendCustomUITabs with FrontendTabs.Tab
     - Do not skip over TabItem usage inside the FrontendPreBuiltUITabs
  - FrontendCustomUITabs -> FrontendTabs
     - Replace the usage of TabItem inside the FrontendCustomUITabs with FrontendTabs.Tab
  - PasswordlessFrontendForm -> PasswordlessForm
  - ConditionalSection -> ContextCondition (rename the conditions prop to condition)
  - PythonSyncAsyncSubTabs -> PythonSyncAsyncCard
     - Replace the usage of TabItem inside the PythonSyncAsyncSubTabs with PythonSyncAsyncCard.Content
  - NodeJSFrameworkSubTabsServerless -> NodeJSFrameworksCard
     - Replace the usage of TabItem inside the NodeJSFrameworkSubTabsServerless with NodeJSFrameworksCard.Content
  - PythonFrameworkSubTabs -> PythonFrameworksCard
     - Replace the usage of TabItem inside the PythonFrameworkSubTabs with PythonFrameworksCard.Content
  - GoFrameworkSubTabs -> GoFrameworksCard
     - Replace the usage of TabItem inside the GoFrameworkSubTabs with GoFrameworksCard.Content

- Remove the usage of the following components:
  - CoreInjector
  - OAuthVerifyTokensDisclaimer
- If you encounter a CustomAdmonition component replace it with a normal mdx admonition: 
:::info <type-property>
<children>
:::
The <type-property> should be formatted in a human readable way.
- Do not change the markdown content that exists inside a jsx element
- Remove the show_ui_switcher property from the frontmatter data (if preset) 
- Add a new property to the frontmatter data called "sidebar_position" and set it to 1
- Don't add or remove links. Do not change any URL.
- Always preserve the original line breaks. Do not add or remove blank lines.
- Based on the jsx elements used add import statements at the top of the file based on the following import example:
- DO NOT include the generated result in an mdx code block. Just return the actual content.
- Only return the MDX content. Don not add any other comments and do not wrap the content in and MDX code block.
- Only return the generated content without wrapping it in backticks.
import { UIType } from "/src/components/UITypeSwitch";
import {
  FrontendTabs,
  BackendTabs,
  ReactRouterVersionTabs,
} from "/src/components/Tabs";
import { AppInfoForm } from "/src/components/AppInfoForm";
import { PasswordlessForm } from "/src/components/Forms";
import { NodePackageManagerCard, NpmOrScriptsCard, MobileFrameworksCard,  } from "/src/components/Cards";
import { Question, Answer } from "/src/components/Question";
import { ContextCondition } from "/src/components/DocItemContext";
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

function listFiles(folderPath: string) {
	const allFiles: string[] = [];
	try {
		const files = fs.readdirSync(folderPath);
		files.forEach((file) => {
			const filePath = path.join(folderPath, file);
			if (fs.statSync(filePath).isDirectory()) {
				const nestedFiles = listFiles(filePath);
				allFiles.push(...nestedFiles);
			} else {
				allFiles.push(filePath);
			}
		});
	} catch (error) {
		console.error(`Error reading folder: ${folderPath}`);
	}
	return allFiles;
}

const printStatus = (status: string) => {
	process.stdout.write("\x1b[1A\x1b[2K"); // clear previous line
	console.log(status);
};
