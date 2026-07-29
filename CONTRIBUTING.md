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

Used to run the code block validation and formatting.
For install instructions check the [guide](https://docs.docker.com/get-docker/).

### Testing Steps

#### Linting

Use the following commands to perform linting checks on the entire project:

- `npm run lint:prettier`: Formats supported files with Prettier.
- `npm run lint:prettier:check`: Checks formatting without changing files.
- `npm run lint:vale`: Runs Vale on Markdown files and high-signal typo rules on TSX files.
- `npm run validate`: Runs strict navigation and link validation.
- `npm run build`: Regenerates the route manifest and builds the site.

#### Validating code blocks

Run `npm run check-code-blocks <language>` to validate all the code blocks for a particular language.

Code block validation is done in two steps:

- First, we extract all the code blocks from the `MDX` files and save them in the `/scripts/code-type-checking/<language>/snippets` folder.
- Then, we load the code in a Docker image and run it to validate the code. This way we do not have to deal with installing different dependencies for different languages.
