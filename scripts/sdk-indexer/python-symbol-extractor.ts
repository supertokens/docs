import Parser from "tree-sitter";
import Python from "tree-sitter-python";

import { BaseSymbolExtractor } from "./symbol-extractor";
import { Symbol, FunctionSymbol, TypeSymbol } from "./types";

export class PythonSymbolExtractor extends BaseSymbolExtractor {
  language: "python" = "python";
  include = ["**/*.py"];
  exclude = [
    "**/venv/**",
    "**/env/**",
    "**/__pycache__/**",
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/.git/**",
  ];

  constructor(public files: string[]) {
    super();
    this.parser.setLanguage(Python);
  }

  protected extractFromFile(file: string, content: string): Symbol[] {
    const tree = this.parser.parse(content);

    const symbols: Symbol[] = [];
    this.traverse(tree.rootNode, symbols, file, content);

    return symbols;
  }

  private traverse(node: Parser.SyntaxNode, symbols: Symbol[], file: string, content: string): void {
    let symbol: Symbol | null = null;
    switch (node.type) {
      case "function_definition":
        symbol = this.extractFunctionSymbol(node, file, content);
        break;
      case "class_definition":
        symbol = this.extractTypeSymbol(node, file, content);
        break;
    }

    if (symbol) symbols.push(symbol);

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;
      this.traverse(child, symbols, file, content);
    }
  }

  private extractFunctionSymbol(node: Parser.SyntaxNode, file: string, content: string): FunctionSymbol | null {
    let nameNode: Parser.SyntaxNode | null = null;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type === "identifier") {
        nameNode = child;
        break;
      }
    }

    if (!nameNode) return null;

    const name = nameNode.text;

    // Skip private functions
    if (name.startsWith("_") && !name.startsWith("__")) {
      return null;
    }

    const parameters = this.extractParameters(node);
    const returnType = this.extractReturnType(node);
    const isAsync = this.isAsyncFunction(node);

    return {
      name,
      type: "function",
      file,
      line: node.startPosition.row,
      content: this.getNodeContent(node, content),
      comments: this.extractComments(node),
      meta: {
        parameters,
        returnType,
        isAsync,
        isStatic: this.isStaticMethod(node),
      },
    };
  }

  private extractTypeSymbol(node: Parser.SyntaxNode, file: string, content: string): TypeSymbol | null {
    let nameNode: Parser.SyntaxNode | null = null;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type === "identifier") {
        nameNode = child;
        break;
      }
    }

    if (!nameNode) return null;

    const name = nameNode.text;

    if (name.startsWith("_")) {
      return null;
    }

    let kind: "interface" | "type" | "enum" | "alias" = "type";

    const argumentList = this.findChildByType(node, "argument_list");
    if (argumentList) {
      const argumentText = argumentList.text;
      if (argumentText.includes("ABC") || argumentText.includes("Protocol")) {
        kind = "interface";
      }
    }

    const decorators = this.extractDecorators(node);
    if (decorators.some((d) => d.includes("enum"))) {
      kind = "enum";
    }

    return {
      name,
      type: "type",
      file,
      line: node.startPosition.row,
      content: this.getNodeContent(node, content),
      comments: this.extractComments(node),
      meta: {
        definition: this.getNodeContent(node, content),
        kind,
      },
    };
  }

  private extractParameters(
    functionNode: Parser.SyntaxNode,
  ): Array<{ name: string; type: string; optional?: boolean }> {
    const parametersNode = this.findChildByType(functionNode, "parameters");
    if (!parametersNode) return [];

    const params: Array<{ name: string; type: string; optional?: boolean }> = [];

    for (let i = 0; i < parametersNode.childCount; i++) {
      const child = parametersNode.child(i);
      if (!child) continue;

      if (child.type === "identifier") {
        params.push({
          name: child.text,
          type: "Any",
          optional: false,
        });
      } else if (child.type === "typed_parameter") {
        const identifierChild = this.findChildByType(child, "identifier");
        const typeChild = this.findChildByType(child, "type");

        if (identifierChild) {
          params.push({
            name: identifierChild.text,
            type: typeChild ? typeChild.text : "Any",
            optional: false,
          });
        }
      } else if (child.type === "default_parameter") {
        const identifierChild = this.findChildByType(child, "identifier");
        const typeChild = this.findChildByType(child, "type");

        if (identifierChild) {
          params.push({
            name: identifierChild.text,
            type: typeChild ? typeChild.text : "Any",
            optional: true,
          });
        }
      } else if (child.type === "typed_default_parameter") {
        const identifierChild = this.findChildByType(child, "identifier");
        const typeChild = this.findChildByType(child, "type");

        if (identifierChild) {
          params.push({
            name: identifierChild.text,
            type: typeChild ? typeChild.text : "Any",
            optional: true,
          });
        }
      }
    }

    return params;
  }

  private extractReturnType(functionNode: Parser.SyntaxNode): string {
    for (let i = 0; i < functionNode.childCount; i++) {
      const child = functionNode.child(i);
      if (child && child.type === "type") {
        return child.text;
      }
    }

    return "None";
  }

  private isAsyncFunction(functionNode: Parser.SyntaxNode): boolean {
    for (let i = 0; i < functionNode.childCount; i++) {
      const child = functionNode.child(i);
      if (child && child.text === "async") {
        return true;
      }
    }
    return false;
  }

  private isStaticMethod(functionNode: Parser.SyntaxNode): boolean {
    const decorators = this.extractDecorators(functionNode);
    return decorators.some((d) => d.includes("staticmethod"));
  }

  private extractDecorators(node: Parser.SyntaxNode): string[] {
    const decorators: string[] = [];
    let current = node.previousSibling;

    while (current && current.type === "decorator") {
      decorators.unshift(current.text);
      current = current.previousSibling;
    }

    return decorators;
  }

  private findChildByType(node: Parser.SyntaxNode, type: string): Parser.SyntaxNode | null {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type === type) {
        return child;
      }
    }
    return null;
  }
}

