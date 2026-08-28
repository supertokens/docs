# Contributing to the SuperTokens Documentation

Thank you for your interest in contributing to the SuperTokens documentation!
This guide provides all the information needed to set up, build, and contribute effectively to this repository.

## Overview

The documentation site uses [Blume](https://useblume.dev/) to build Markdown and MDX into a static website.
Blume provides file-based navigation, local search, OpenAPI references, and built-in documentation components.

## How to run the project

### Prerequisites

To work with the documentation project locally, ensure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/) 22.12 or newer

### Setup Steps

1. Install dependencies:

```bash
npm ci
```

2. Start the development server:

```bash
npm run start
```

Vercel deploys previews and production from this repository. Production sets the public origin from Vercel's deployment environment; set `DOCS_PUBLIC_ORIGIN` only when a non-Vercel build needs canonical URLs and a sitemap.

## Project Structure

The main directories are:

- `docs`: Documentation content and colocated `meta.ts` navigation files.
- `components`: Astro components registered for use in MDX.
- `islands`: Interactive React components.
- `openapi`: CDI and FDI OpenAPI specifications.
- `public`: Static assets.

Below is a breakdown of the main directories and files in the project:

```
├── docs                     # Documentation pages and meta.ts navigation
├── components               # Astro MDX components
├── islands                  # Interactive React components
├── openapi                  # CDI and FDI specifications
├── public                   # Static assets
├── scripts
└── blume.config.ts
```

### Routing

The project uses file-based routing. Use a folder's `meta.ts` to configure category navigation and `sidebar.order` in page frontmatter to order pages.

#### Where to place a new page

##### The `Documentation` Section

The `Documentation` section includes guides and tutorials for integrating **SuperTokens**.

Pages are grouped based on where that subject might be relevant during the lifecycle of an authentication flow.

- The initial `Authentication` phase covers information about the sign up/sign in flow relative to each authentication method that we support.
- `Additional Verification` includes extra layers the extra protection layers that can be added (MFA, Bot Detection, etc.)
- `Post Authentication` covers things that should happen after a user has been authenticated (managing sessions, linking accounts, etc.)
- High level topics like, that don't fit into the previous buckets, like `Multi-Tenancy` and `Migration`, are treated as individual categories.
- `Platform Configuration` and `Deployment` talk about the final steps in the process of going to production with your **SuperTokens** integration.

###### Quickstart

`Quickstart` is the first category in the sidebar since that is the main thing that new users will look after.
It includes `quickstart` guides that show how to get from zero to a fully working application that uses **SuperTokens**.

##### The `References` Section

The `References` section includes reference style pages that that talk about different aspects of our SDKs and APIs.

## How to add changes

As mentioned before, most of the "action" happens in the `/docs` folder.
To add or edit a documentation page just start from there and keep in mind the next instructions.

## Writing Guide

The following paragraphs describe what you should keep in mind when you write documentation content.
Treat this as a guide rather than a rulebook.
Your aim should be to follow the general style.
But there are exceptions to most rules.

### 1. **Clarity**

- Use simple, direct language to explain concepts and instructions. Remove words that don’t add substance.
- Write in the active voice.
  - Example: "The function returns a result" (not "A result is returned by the function").
- Avoid vague or ambiguous statements. Be specific and actionable.
- Avoid using Latin abbreviations "i.e." or "e.g.". Use "that is" or "for example" instead.

### 2. **Consistency**

- Define acronyms on first use.
  - Example: "Command-Line Interface (CLI)."
- Use a friendly tone of voice.
- Use American spelling.

### 3. **User Focus**

- Address the user directly and prioritize their perspective.
  - Example: "Click the button to save your changes."
- Explain concepts in terms of what the user can do, not what they can't.
  - Positive: "To access paid features you need to generate a license key."
  - Negative: "You can not access paid features out of the box. Generate a license key first."

### 4. **Conciseness**

- Remove unnecessary words and phrases.
  - Avoid fillers like "so," "simply," "easily," and "very."
  - Replace verbose phrases with shorter alternatives:
    - Use "to" instead of "in order to."
    - Use "now" instead of "at the present time."
- Avoid repetition unless summarizing key points for clarity.
- Avoid temporal words like "currently", "now", "will", etc. Describe the present state of the product.

### 5. **Structure and Flow**

- Organize content logically with headings and subheadings.
- Summarize key points at the end of sections or pages to reinforce understanding.
- Use numbered or bulleted lists for steps, examples, and key takeaways.

### 6. **Avoid Marketing Speak**

- Stick to factual, clear descriptions. Let the product's functionality speak for itself.
- Avoid exaggerations, superlatives, or subjective statements.
  - Instead of "Our product is incredibly fast," write "This product processes data in under X milliseconds."

### 7. **Respect the Reader’s Time**

- Assume the reader is trying to solve a problem or learn something specific.
- Provide the most critical information first and link to detailed content for further reading.
- Use an "elevator pitch" approach for complex topics:
  - Start with a concise overview before diving into details.

### 8. **Be Objective and Neutral**

- Avoid opinions, criticisms, or personal commentary.
- Focus on presenting information that helps the user achieve their goals.

## How to test your changes

### Prerequisites

Before running the actual checks you need to install some dependencies.

#### Vale

Used to validate the content of the `MDX` files.
For other platforms check the [installation guide](https://vale.sh/docs/install).

```sh
brew install vale
```

#### bun

Used to run the files in the `scripts` folder.

```sh
npm install -g bun
```

#### Docker

Used to build the language-specific code block checkers.
For install instructions check the [guide](https://docs.docker.com/get-docker/).

### Testing Steps

#### Linting

Use the following commands to perform linting checks on the entire project:

- `npm run lint:prettier`: Formats supported files with Prettier.
- `npm run lint:prettier:check`: Checks formatting without changing files.
- `npm run lint:code-blocks -- [path...]`: Checks registered languages, empty blocks, numeric highlight metadata, exclusion markers, and supported Prettier formatting without changing files. Paths can be files or directories; the command defaults to all files in `docs`.
- `npm run lint:vale`: Runs Vale on Markdown files and high-signal typo rules on TSX files.
- `npm run validate`: Runs strict navigation and link validation.
- `npm run build`: Regenerates the route manifest and builds the site.

#### Validating code blocks

Use these commands for code blocks in Markdown and MDX files:

- `npm run format-code-blocks [path...]`: Formats supported fenced TypeScript, JavaScript, JSON, YAML, and HTML. Paths can be files or directories; the command defaults to `docs`.
- `npm run write-code-blocks -- [path...]`: Extracts compilable code blocks from `.md` and `.mdx` files. Paths can be files or directories; the command defaults to all files in `docs`. It fails when a fence has a missing or unknown language.
- `npm run check-code-blocks <language>`: Builds the Docker checker for the language. Validation runs as part of the image build; the image is not run afterward.

#### Continuous integration

For pull requests, code-block CI checks only changed documentation files and the languages generated from them. Changes to checker or test infrastructure trigger a full check, as do changes affecting more than 100 documentation files or a changed-file path list larger than 50 KB. Linting, infrastructure tests, and extraction run in parallel as their dependencies allow; language checks run after extraction.

Set the repository variable `RUN_FULL_CODE_BLOCK_CHECKS=true` to run full code-block checks before the GitHub Build job in the non-pull-request deployment flow. If Vercel deploys directly from Git, configure Vercel to require the GitHub Build check externally.

Run linting and extraction before a language checker so it does not validate stale snippets:

```sh
npm run lint:code-blocks
npm run write-code-blocks
npm run check-code-blocks javascript
```

Checker names are `javascript`, `go`, `python`, `kotlin`, `swift`, `dart`, `php`, `java`, and `csharp`. TypeScript and JavaScript fences both use the `javascript` checker.

Generated snippets are stored under `scripts/code-type-checking/<language>/snippets`, preserving the source path and including the fence's source line in each generated path.

For an intentionally non-standalone snippet, add `check=false` and a non-empty, quoted reason to the code fence. This excludes it from formatting and type checking:

````md
```ts check=false reason="Requires application context"
const app = getApplicationInstance();
```
````

An exclusion must contain exactly one unquoted `check=false` and exactly one closed, double-quoted, non-empty `reason`. Reason text may contain ASCII letters, numbers, spaces, and `. , ; : ! ? ( ) / _ + -`. Braces, quotes, backslashes, control characters, and newlines are not allowed because fence metadata is passed to Shiki.

The lint and snippet writer reject malformed, duplicate, contradictory, or unsupported metadata. Invalid metadata does not skip formatting or extraction. Do not use this escape hatch for standalone snippets that can be made valid.

Legacy exclusions using one of these exact comments as the first content line remain supported:

- `// exclude-from-type-checking`
- `# exclude-from-type-checking`
