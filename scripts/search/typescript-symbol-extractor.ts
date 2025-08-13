import Parser from "tree-sitter";
import TypeScript from "tree-sitter-typescript";

import { BaseSymbolExtractor, FileWithNamespace } from "./symbol-extractor";
import { Symbol, ClassSymbol, TypeSymbol, SymbolExtractor, FunctionSymbol } from "./types";

export class TypeScriptSymbolExtractor extends BaseSymbolExtractor implements SymbolExtractor {
  language: "typescript" = "typescript";
  include = ["**/*.ts", "**/*.tsx"];
  exclude = ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"];

  constructor(files: FileWithNamespace[]) {
    super(files);
    this.parser.setLanguage(TypeScript.typescript);
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
      case "class_declaration":
        symbol = this.extractClassSymbol(node, file, content, namespace);
        break;
      case "function_declaration":
        symbol = this.extractFunctionSymbol(node, file, content, namespace);
        break;
      case "interface_declaration":
      case "type_alias_declaration":
      case "enum_declaration":
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
    const comments = this.extractComments(node);
    const nodeName = node.childForFieldName("name");
    if (!nodeName) return null;
    return {
      name: nodeName.text,
      file,
      type: "function",
      line: node.startPosition.row,
      content: this.getNodeContent(node, content),
      comments,
      namespace,
      deprecated: this.isDeprecated(comments),
      meta: {
        parameters: this.extractParameters(node),
        returnType: this.extractReturnType(node),
        isAsync: this.isAsync(node),
        isStatic: this.isStatic(node),
      },
    };
  }

  private extractClassSymbol(
    node: Parser.SyntaxNode,
    file: string,
    content: string,
    namespace: string,
  ): ClassSymbol | null {
    const isExported = this.isExported(node);
    if (!isExported) return null;
    const nameNode = node.childForFieldName("name");
    if (!nameNode) return null;

    const methods: ClassSymbol["meta"]["methods"] = [];
    const properties: ClassSymbol["meta"]["properties"] = [];
    let constructorArgs: Array<{ name: string; type: string; optional: boolean }> = [];

    const body = node.childForFieldName("body");
    if (body) {
      for (let i = 0; i < body.childCount; i++) {
        const member = body.child(i);
        if (!member) continue;
        const memberName = member.childForFieldName("name");

        if (memberName) {
          if (member.type === "method_definition") {
            if (memberName.text === "constructor") {
              constructorArgs = this.extractParameters(member);
            } else {
              const methodComments = this.extractComments(member);
              methods.push({
                name: memberName.text,
                parameters: this.extractParameters(member),
                returnType: this.extractReturnType(member),
                isAsync: this.isAsync(member),
                isStatic: this.isStatic(member),
                visibility: this.extractClassPropertyVisibility(member),
                line: member.startPosition.row,
                content: this.getNodeContent(member, content),
                comments: methodComments,
              });
            }
          } else if (member.type === "public_field_definition") {
            properties.push({
              name: member.childForFieldName("name")?.text as string,
              visibility: this.extractClassPropertyVisibility(member),
              isStatic: this.isStatic(member),
              type: this.extractType(member),
              line: member.startPosition.row,
            });
          }
        }
      }
    }

    const comments = this.extractComments(node);
    return {
      name: nameNode.text,
      type: "class",
      file,
      line: node.startPosition.row,
      content: this.getNodeContent(node, content),
      comments,
      namespace,
      deprecated: this.isDeprecated(comments),
      meta: {
        methods,
        properties,
        constructorArgs,
      },
    };
  }

  private extractTypeSymbol(
    node: Parser.SyntaxNode,
    file: string,
    content: string,
    namespace: string,
  ): TypeSymbol | null {
    if (!this.isExported(node)) return null;
    const nameNode = node.childForFieldName("name");
    if (!nameNode) return null;

    let kind: "interface" | "type" | "enum" | "alias" = "alias";
    if (node.type === "interface_declaration") kind = "interface";
    else if (node.type === "type_alias_declaration") kind = "type";
    else if (node.type === "enum_declaration") kind = "enum";

    const comments = this.extractComments(node);
    return {
      name: nameNode.text,
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

  private extractParameters(functionNode: Parser.SyntaxNode): Array<{ name: string; type: string; optional: boolean }> {
    const parametersNode =
      functionNode.childForFieldName("parameters") || functionNode.childForFieldName("formal_parameters");
    if (!parametersNode) return [];

    const params: Array<{ name: string; type: string; optional: boolean }> = [];
    for (let i = 0; i < parametersNode.childCount; i++) {
      const child = parametersNode.child(i);
      if (!child) continue;
      if (child.type === "required_parameter" || child.type === "optional_parameter") {
        const nameNode = child.childForFieldName("pattern");
        params.push({
          name: nameNode?.text || "unknown",
          type: this.extractType(child) as string,
          optional: child.type === "optional_parameter",
        });
      }
    }
    return params;
  }

  private extractReturnType(functionNode: Parser.SyntaxNode): string {
    const node = functionNode.childForFieldName("return_type");
    if (!node) return "void";
    const predefinedTypeNode = node.children.find((child) => child.type === "predefined_type");
    return predefinedTypeNode?.text || "void";
  }

  private isExported(node: Parser.SyntaxNode): boolean {
    return node.parent?.type === "export_statement";
  }

  private isAsync(node: Parser.SyntaxNode): boolean {
    for (let i = 0; i < node.childCount; i++) {
      const child = node.child(i);
      if (!child) continue;
      if (child.type === "async") return true;
    }
    return false;
  }

  private isStatic(node: Parser.SyntaxNode): boolean {
    const staticNode = node.children.find((child) => child.type === "static");
    return staticNode !== undefined;
  }

  private extractType(node: Parser.SyntaxNode): string | undefined {
    const typeNode = node.childForFieldName("type");
    if (!typeNode) return undefined;
    const predefinedTypeNode = typeNode.children.find((child) => child.type === "predefined_type");
    if (predefinedTypeNode) return predefinedTypeNode.text;
    // the first child is ":"
    let typeText = typeNode.children[1].text;
    // keep at least one space between
    const unformattedTypeText = typeText.replace(/\s+/g, " ");
    return unformattedTypeText;
  }

  private extractClassPropertyVisibility(node: Parser.SyntaxNode): "public" | "private" | "protected" {
    const accessibilityModifierNode = node.children.find((child) => child.type === "accessibility_modifier");
    if (!accessibilityModifierNode) return "public";
    return accessibilityModifierNode.text as "public" | "private" | "protected";
  }

  protected extractComments(node: Parser.SyntaxNode): string | null {
    // For exported declarations, check the parent's (export_statement) previous siblings
    let searchNode = node;
    if (node.parent?.type === "export_statement") {
      searchNode = node.parent;
    }

    let current = searchNode.previousSibling;
    const comments: string[] = [];

    while (current) {
      if (current.type === "comment") {
        comments.unshift(current.text);
        current = current.previousSibling;
      } else if (current.text.trim() === "") {
        // Skip whitespace
        current = current.previousSibling;
      } else {
        break;
      }
    }

    return comments.length > 0 ? comments.join("\n") : null;
  }
}
