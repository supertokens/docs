import Parser from "tree-sitter";
import Go from "tree-sitter-go";

import { BaseSymbolExtractor, FileWithNamespace } from "./symbol-extractor";
import { Symbol, FunctionSymbol, TypeSymbol } from "./types";

export class GoSymbolExtractor extends BaseSymbolExtractor {
  language: "go" = "go";
  include = ["**/*.go"];
  exclude = ["**/vendor/**", "**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"];

  constructor(files: FileWithNamespace[]) {
    super(files);
    this.parser.setLanguage(Go);
  }

  protected extractFromFile(file: string, content: string, namespace: string): Symbol[] {
    const tree = this.parser.parse(content);

    const symbols: Symbol[] = [];
    this.traverse(tree.rootNode, symbols, file, content, namespace);

    return symbols;
  }

  private traverse(node: Parser.SyntaxNode, symbols: Symbol[], file: string, content: string, namespace: string): void {
    let symbol: Symbol | null = null;
    switch (node.type) {
      case "function_declaration":
      case "method_declaration":
        symbol = this.extractFunctionSymbol(node, file, content, namespace);
        break;
      case "type_declaration":
        symbol = this.extractTypeSymbol(node, file, content, namespace);
        break;
    }

    if (symbol) symbols.push(symbol);

    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;
      this.traverse(child, symbols, file, content, namespace);
    }
  }

  private extractFunctionSymbol(
    node: Parser.SyntaxNode,
    file: string,
    content: string,
    namespace: string,
  ): FunctionSymbol | null {
    let nameNode: Parser.SyntaxNode | null = null;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && (child.type === "identifier" || child.type === "field_identifier")) {
        nameNode = child;
        break;
      }
    }

    if (!nameNode) return null;

    const name = nameNode.text;

    // Skip unexported functions
    if (name.charAt(0) === name.charAt(0).toLowerCase()) {
      return null;
    }

    const parameters = this.extractParameters(node);
    const returnType = this.extractReturnType(node);

    const comments = this.extractComments(node);
    return {
      name,
      type: "function",
      file,
      line: node.startPosition.row,
      content: this.getNodeContent(node, content),
      comments,
      namespace,
      deprecated: this.isDeprecated(comments),
      meta: {
        parameters,
        returnType,
        isAsync: false,
        isStatic: node.type === "function_declaration",
      },
    };
  }

  private extractTypeSymbol(
    node: Parser.SyntaxNode,
    file: string,
    content: string,
    namespace: string,
  ): TypeSymbol | null {
    let typeSpec: Parser.SyntaxNode | null = null;
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (child && child.type === "type_spec") {
        typeSpec = child;
        break;
      }
    }

    if (!typeSpec) return null;

    const nameNode = typeSpec.child(0);
    if (!nameNode || nameNode.type !== "type_identifier") return null;

    const name = nameNode.text;

    if (name.charAt(0) === name.charAt(0).toLowerCase()) {
      return null;
    }

    const typeNode = typeSpec.child(1);
    let kind: "interface" | "type" | "enum" | "alias" = "alias";

    if (typeNode) {
      switch (typeNode.type) {
        case "interface_type":
          kind = "interface";
          break;
        case "struct_type":
          kind = "type";
          break;
        default:
          kind = "alias";
      }
    }

    const comments = this.extractComments(node);
    return {
      name,
      type: "type",
      file,
      line: node.startPosition.row,
      content: this.getNodeContent(node, content),
      comments,
      namespace,
      deprecated: this.isDeprecated(comments),
      meta: {
        definition: this.getNodeContent(node, content),
        kind,
      },
    };
  }

  private extractParameters(
    functionNode: Parser.SyntaxNode,
  ): Array<{ name: string; type: string; optional?: boolean }> {
    let parametersNode: Parser.SyntaxNode | null = null;
    let parameterListCount = 0;

    for (let i = 0; i < functionNode.childCount; i++) {
      const child = functionNode.child(i);
      if (child && child.type === "parameter_list") {
        parameterListCount++;
        if (functionNode.type === "method_declaration" && parameterListCount === 1) {
          continue;
        }
        parametersNode = child;
        break;
      }
    }

    if (!parametersNode) return [];

    const params: Array<{ name: string; type: string; optional?: boolean }> = [];

    for (let i = 0; i < parametersNode.childCount; i++) {
      const child = parametersNode.child(i);
      if (!child) continue;

      if (child.type === "parameter_declaration") {
        const nameNode = child.child(0);
        const typeNode = child.child(1);

        if (nameNode && typeNode && nameNode.type === "identifier") {
          params.push({
            name: nameNode.text,
            type: typeNode.text,
            optional: false,
          });
        }
      }
    }

    return params;
  }

  private extractReturnType(functionNode: Parser.SyntaxNode): string {
    let parameterListNodes: Parser.SyntaxNode[] = [];

    for (let i = 0; i < functionNode.childCount; i++) {
      const child = functionNode.child(i);
      if (child && child.type === "parameter_list") {
        parameterListNodes.push(child);
      }
    }

    if (functionNode.type === "function_declaration") {
      if (parameterListNodes.length === 2) {
        const returnTypesNode = parameterListNodes[1];
        const returnTypes: string[] = [];

        for (let j = 0; j < returnTypesNode.childCount; j++) {
          const returnChild = returnTypesNode.child(j);
          if (returnChild && returnChild.type === "parameter_declaration") {
            const typeNode = returnChild.child(0);
            if (typeNode && typeNode.type !== "," && typeNode.type !== "(" && typeNode.type !== ")") {
              returnTypes.push(typeNode.text);
            }
          }
        }
        return returnTypes.length > 0 ? `(${returnTypes.join(", ")})` : "void";
      }
    } else if (functionNode.type === "method_declaration") {
      if (parameterListNodes.length === 3) {
        const returnTypesNode = parameterListNodes[2];
        const returnTypes: string[] = [];

        for (let j = 0; j < returnTypesNode.childCount; j++) {
          const returnChild = returnTypesNode.child(j);
          if (returnChild && returnChild.type === "parameter_declaration") {
            const typeNode = returnChild.child(0);
            if (typeNode && typeNode.type !== "," && typeNode.type !== "(" && typeNode.type !== ")") {
              returnTypes.push(typeNode.text);
            }
          }
        }
        return returnTypes.length > 0 ? `(${returnTypes.join(", ")})` : "void";
      }
    }

    let foundLastParameterList = false;
    for (let i = 0; i < functionNode.childCount; i++) {
      const child = functionNode.child(i);
      if (!child) continue;

      if (child.type === "parameter_list") {
        foundLastParameterList = true;
        continue;
      }

      if (foundLastParameterList && child.type !== "block") {
        if (child.type === "type_identifier" || child.type === "pointer_type") {
          return child.text;
        }
      }
    }

    return "void";
  }
}
