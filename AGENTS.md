# AGENTS.md - SuperTokens Documentation

## Build/Test Commands

- `npm run build` - Build the Docusaurus site
- `npm run start` - Start development server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint:prettier` - Format code with Prettier
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

- Components in `src/components/` with feature-based organization
- Utilities in `src/lib/` and `src/hooks/`
- Documentation content in `docs/` using MDX format
- Scripts for automation in `scripts/` directory
