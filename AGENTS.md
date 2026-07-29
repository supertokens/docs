# AGENTS.md - SuperTokens Documentation

## Build/Test Commands

- `npm run build` - Build the Blume site
- `npm run start` - Start development server
- `npm run typecheck` - Check Blume config, components, islands, and content
- `npm run lint:prettier` - Format code with Prettier
- `npm run lint:prettier:check` - Check formatting without writing files
- `npm run lint:vale` - Run Vale documentation linting
- `npm test` - Run all tests with Vitest
- `npm run test:watch` - Run tests in watch mode
- `vitest run <pattern>` - Run specific test files matching pattern

## Code Style Guidelines

- **Formatting**: Use Prettier (2 spaces, double quotes, 120 char width, trailing commas)
- **Imports**: Group external libs first, then internal relative imports with blank line separation
- **TypeScript**: Use strict typing, prefer interfaces for objects, use proper generic types
- **React**: Use functional components with hooks, destructure props, use proper TypeScript types
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **Files**: Use `.tsx` for React components, `.ts` for utilities, organize in feature folders
- **Error Handling**: Use try/catch for async operations, proper error types, avoid silent failures

## Project Structure

- Astro components in `components/`
- React islands in `islands/`
- Documentation content in `docs/` using MDX format
- Navigation metadata in colocated `meta.ts` files
- Scripts for automation in `scripts/` directory
