# SuperTokens Documentation Development Guide

## Build & Development Commands

- Start dev server: `npm run start`
- Build for production: `npm run build`
- Lint code: `npm run lint:prettier`
- Validate content: `npm run lint:vale`
- Run tests: `npm run test`
- Run single test: `npm run test -- -t "test name"`
- Watch tests: `npm run test:watch`
- Check code blocks: `npm run check-code-blocks <language>`

## Code Style Guidelines

- Use TypeScript for all new code
- Follow Docusaurus conventions for MDX files
- Use American English spelling
- Write in active voice and direct language
- Use 2-space indentation
- Import order: React/external libraries first, then internal components
- Error handling: Use try/catch blocks with specific error messages
- Naming: camelCase for variables/functions, PascalCase for components/classes
- Avoid marketing language and subjective statements
- Organize content with clear headings and logical structure
- Define acronyms on first use
- Use functional components with hooks for React code
- Do not import React components inside MDX files. Add them to the `MDXComponents` object in `src/theme/MDXComponents.tsx`

## Project Structure

- `/docs`: MDX content files
- `/src`: React components and website functionality
- `/scripts`: Build and validation scripts

