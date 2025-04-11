export async function customExtract(content: string): Promise<{ name: string; module: string }[]> {
  const imports: Array<{ name: string; module: string }> = [];
  const importStatements: string[] = [];
  const importPattern = /import\s+(?:(?:{[\s\S]*?})|(?:[\w*]+))\s+from\s+['"]([^'"]+)['"]/g;

  let match;
  while ((match = importPattern.exec(content)) !== null) {
    const importStatement = match[0];
    const modulePath = match[1];

    // Check for different import patterns
    if (importStatement.includes("{")) {
      // Named imports like: import { ComponentName } from 'module'
      // or import { ComponentName, AnotherComponent } from 'module'
      const namedMatch = importStatement.match(/import\s+{([\s\S]*?)}\s+from/);
      if (namedMatch && namedMatch[1]) {
        // Process all named imports, handling multi-line imports
        const namedImportsText = namedMatch[1]
          .replace(/\s*,\s*/g, ',') // Normalize commas with spaces
          .replace(/[\r\n]+\s*/g, ''); // Remove line breaks and leading spaces
          
        const namedImports = namedImportsText
          .split(',')
          .map(name => name.trim())
          .filter(name => name.length > 0); // Filter out empty strings
        
        for (const name of namedImports) {
          imports.push({
            name: name,
            module: modulePath,
          });
        }
      }
    } else {
      // Default imports like: import ComponentName from 'module'
      const defaultMatch = importStatement.match(/import\s+([\w*]+)\s+from/);
      if (defaultMatch && defaultMatch[1]) {
        const componentName = defaultMatch[1].trim();
        imports.push({
          name: componentName,
          module: modulePath,
        });
      }
    }

    // the regex extracts imports from code snippets as well
    importStatements.push(importStatement);
  }

  return imports;
}
