import Parser from "tree-sitter";
import { readFileSync } from "fs";
import { SymbolExtractor, Symbol } from "./types";

export interface FileWithNamespace {
  path: string;
  namespace: string;
}

export abstract class BaseSymbolExtractor implements SymbolExtractor {
  abstract language: "typescript" | "go" | "python";
  abstract include: string[];
  abstract exclude: string[];
  protected parser: Parser;
  protected files: FileWithNamespace[];

  constructor(files: FileWithNamespace[]) {
    this.parser = new Parser();
    this.files = files;
  }

  extract() {
    const symbols: Symbol[] = [];

    for (const { path: file, namespace } of this.files) {
      try {
        const content = readFileSync(file, "utf8");
        symbols.push(...this.extractFromFile(file, content, namespace));
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    return symbols;
  }

  protected abstract extractFromFile(file: string, content: string, namespace: string): Symbol[];

  protected extractComments(node: Parser.SyntaxNode): string | null {
    let current = node.previousSibling;
    const comments: string[] = [];

    while (current && current.type === "comment") {
      comments.unshift(current.text);
      current = current.previousSibling;
    }

    return comments.length > 0 ? comments.join("\n") : null;
  }

  protected isDeprecated(comments: string | null): boolean {
    if (!comments) return false;
    const lowerComments = comments.toLowerCase();
    return lowerComments.includes("@deprecated") || lowerComments.includes("deprecated:");
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
