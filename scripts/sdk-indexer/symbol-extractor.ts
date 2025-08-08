import Parser from "tree-sitter";
import { readFileSync } from "fs";
import { glob } from "glob";
import { join } from "path";
import { SymbolExtractor, Symbol } from "./types";

export abstract class BaseSymbolExtractor implements SymbolExtractor {
  abstract language: "typescript" | "go" | "python";
  abstract include: string[];
  abstract exclude: string[];
  protected parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  extract(rootPath: string) {
    const files = this.findFiles(rootPath);
    const symbols: Symbol[] = [];

    for (const file of files) {
      try {
        const content = readFileSync(file, "utf8");
        symbols.push(...this.extractFromFile(file, content));
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    return symbols;
  }

  private findFiles(rootPath: string): string[] {
    const files: string[] = [];

    for (const pattern of this.include) {
      const fullPattern = join(rootPath, pattern);
      const matches = glob.sync(fullPattern, { ignore: this.exclude });
      files.push(...matches);
    }

    return Array.from(new Set(files));
  }

  protected abstract extractFromFile(file: string, content: string): Symbol[];

  protected extractComments(node: Parser.SyntaxNode): string | null {
    let current = node.previousSibling;
    const comments: string[] = [];

    while (current && current.type === "comment") {
      comments.unshift(current.text);
      current = current.previousSibling;
    }

    return comments.length > 0 ? comments.join("\n") : null;
  }

  protected getNodeContent(node: Parser.SyntaxNode, content: string): string {
    const lines = content.split("\n");
    const startLine = node.startPosition.row;
    const endLine = node.endPosition.row;

    if (startLine === endLine) {
      return lines[startLine]?.substring(node.startPosition.column, node.endPosition.column) || "";
    }

    const result: string[] = [];
    for (let i = startLine; i <= endLine; i++) {
      if (i === startLine) {
        result.push(lines[i]?.substring(node.startPosition.column) || "");
      } else if (i === endLine) {
        result.push(lines[i]?.substring(0, node.endPosition.column) || "");
      } else {
        result.push(lines[i] || "");
      }
    }

    return result.join("\n");
  }
}
