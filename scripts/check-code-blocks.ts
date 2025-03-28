import { $ } from "bun";

async function runCodeTypeCheck(language: string) {
  if (!language) {
    console.error("Please provide a language argument");
    process.exit(1);
  }
  console.log(language);

  try {
    const { exitCode } = await $`docker build -t code-check-${language} .`.cwd(
      `./scripts/code-type-checking/${language}`,
    );

    process.exit(exitCode);
  } catch (error) {
    console.error("Error running code type check:", error);
    process.exit(1);
  }
}

const language = process.argv[2];
runCodeTypeCheck(language);
