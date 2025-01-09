# Contributing to the SuperTokens Documentation

Thank you for your interest in contributing to the SuperTokens documentation!
This guide provides all the information needed to set up, build, and contribute effectively to this repository.

## Overview

The documentation project relies on the [Docusaurus](https://docusaurus.io/) framework to transform `MDX` files into an actual static website. MDX allows us to embed React components in the content, unlocking rich, interactive documentation experiences.

That being said, there are several things that are added on top of the Docusaurus utilities in order to adjust the tooling to our needs.
Those are presented throughout this document.

## How to run the project

### Prerequisites

To work with the documentation project locally, ensure you have the following tools installed:

- [Node.js](https://nodejs.org/en/download/) (version 18 or higher)

### Setup Steps

1. Install the dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run start
```

## Project Structure

The two main directories where you will work are:

- `docs`: This is where the actual content sits. All the `.mdx` files are located here.
- `src`: This is where you will find the React components and the custom logic used in the website's functionality.

Below is a breakdown of the main directories and files in the project:

```
├── docs                     # The actual documentation pages
│   ├── _templates           # Templates that can be used as a starting point for new docs
│   ├── _blocks              # Reusable MDX blocks
│   └── [section-name]
│       └── _category_.json  # Info about how the folder will be shown in the left sidebar
├── src                      # The business logic of the website
│   ├── components
│   ├── context
│   ├── css
│   ├── hooks
│   ├── lib
│   ├── plugins              # Plugins used by docusaurus during the build process
│   └── theme                # Docusaurus components that get adjusted by us
├── scripts
├── sidebars.ts
└── docusaurus.config.ts
```

### Routing

The project uses file based routing so it's pretty straightforward to determine the actual path of a page.
Each subfolder has a `_category_.json` file that specifies the name of the sidebar category and the order of the pages inside that category.
Additionally, each MDX file has a `sidebar_position` property that specifies the order of the page inside the sidebar category.

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

### MDX Pages

### Writing Guidelines

### Code Style

### Writing Components

### Styling Guidelines

## How to test your code

### Preqrequisites

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

Used to run the code block validation.
For other platforms check the [installation guide](https://docs.docker.com/get-docker/).

### Testing Steps

#### Linting

Run `npm run lint` to perform a linting check on the entire project.
This will do two things:

- Use prettier to check for potential formatting issues.
- Use vale to check if the content of the `MDX` files are in line with the style guide.

#### Validating code blocks

Run `npm run check-code-blocks <language>` to validate all the code blocks for a particular language.

Code block validation is done in two steps:

- First, we extract all the code blocks from the `MDX` files and save them in the `/scripts/code-type-checking/<language>/snippets` folder.
- Then, we load the code in a Docker image and run it to validate the code. This way we do not have to deal with installing different dependencies for different languages.
