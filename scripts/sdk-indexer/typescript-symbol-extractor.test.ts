import { describe, it, expect } from "vitest";
import { TypeScriptSymbolExtractor } from "./typescript-symbol-extractor";
import { ClassSymbol, TypeSymbol } from "./types";

const extractor = new TypeScriptSymbolExtractor(["test.ts"]);

function extractClassSymbols(code: string): ClassSymbol[] {
  const symbols = extractor["extractFromFile"]("test.ts", code);
  return symbols.filter((s) => s.type === "class") as ClassSymbol[];
}

function extractTypeSymbols(code: string): TypeSymbol[] {
  const symbols = extractor["extractFromFile"]("test.ts", code);
  return symbols.filter((s) => s.type === "type") as TypeSymbol[];
}

describe("typescript-symbol-extractor", () => {
  describe("ClassSymbol", () => {
    it("should extract a class", () => {
      const code = `export class MyClass {}`;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyClass");
      expect(symbol?.type).toBe("class");
    });

    it("should extract a class with properties", () => {
      const code = `
        export class MyClass {
          public prop1: string;
          private prop2: number = 42;
          prop3;
        }
      `;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyClass");
      expect(symbol?.type).toBe("class");
      expect(symbol?.meta.constructorArgs).toHaveLength(0);
      expect(symbol?.meta.methods).toHaveLength(0);
      expect(symbol?.meta.properties).toHaveLength(3);
      expect(symbol?.meta.properties).toEqual([
        {
          name: "prop1",
          type: "string",
          visibility: "public",
          isStatic: false,
          line: 2,
        },
        {
          name: "prop2",
          type: "number",
          visibility: "private",
          isStatic: false,
          line: 3,
        },
        {
          name: "prop3",
          type: undefined,
          visibility: "public",
          isStatic: false,
          line: 4,
        },
      ]);
    });

    it("should extract a class with methods", () => {
      const code = `
        export class MyClass {
          public myMethod(): void {}
          private async privateAsyncMethod(): Promise<string> {
            return "hello";
          }
        }
      `;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyClass");
      expect(symbol?.type).toBe("class");
      expect(symbol?.meta.constructorArgs).toHaveLength(0);
      expect(symbol?.meta.properties).toHaveLength(0);
      expect(symbol?.meta.methods).toHaveLength(2);
      expect(symbol?.meta.methods).toEqual([
        {
          name: "myMethod",
          parameters: [],
          visibility: "public",
          returnType: "void",
          isStatic: false,
          isAsync: false,
          line: 2,
        },
        {
          name: "privateAsyncMethod",
          parameters: [],
          visibility: "private",
          returnType: "void",
          isStatic: false,
          isAsync: true,
          line: 3,
        },
      ]);
    });

    it("should extract a class with constructor arguments", () => {
      const code = `
        export class MyClass {
          constructor(param1: string, private param2?: number) {}
        }
      `;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyClass");
      expect(symbol?.type).toBe("class");
      expect(symbol?.meta.methods).toHaveLength(0);
      expect(symbol?.meta.properties).toHaveLength(0);
      expect(symbol?.meta.constructorArgs).toHaveLength(2);
      expect(symbol?.meta.constructorArgs).toEqual([
        {
          name: "param1",
          type: "string",
          optional: false,
        },
        {
          name: "param2",
          type: "number",
          optional: true,
        },
      ]);
    });

    it("should not extract a class that is not exported", () => {
      const code = `class MyClass {}`;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeUndefined();
    });
  });

  describe("TypeSymbol", () => {
    it("should extract a type", () => {
      const code = `export type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyType");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("type");
    });
    it("should extract multiple types", () => {
      const code = `
        export type MyType = string;
        export type MyOtherType = number;
      `;
      const [symbol1, symbol2] = extractTypeSymbols(code);
      expect(symbol1).toBeDefined();
      expect(symbol1?.name).toBe("MyType");
      expect(symbol1?.type).toBe("type");
      expect(symbol1?.meta.kind).toBe("type");

      expect(symbol2).toBeDefined();
      expect(symbol2?.name).toBe("MyOtherType");
      expect(symbol2?.type).toBe("type");
      expect(symbol2?.meta.kind).toBe("type");
    });
    it("should extract a type with a definition", () => {
      const code = `export type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
    });
    it("should extract an interface", () => {
      const code = `export interface MyInterface {}`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyInterface");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("interface");
    });
    it("should extract an enum", () => {
      const code = `export enum MyEnum {}`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyEnum");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("enum");
    });
    it("should not extract a type that is not exported", () => {
      const code = `type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeUndefined();
    });
  });
});
