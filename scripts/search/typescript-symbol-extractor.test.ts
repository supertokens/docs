import { describe, it, expect } from "vitest";
import { TypeScriptSymbolExtractor } from "./typescript-symbol-extractor";
import { ClassSymbol, FunctionSymbol, TypeSymbol } from "./types";

const testNamespace = "test-namespace";
const extractor = new TypeScriptSymbolExtractor([{ path: "test.ts", namespace: testNamespace }]);

function extractClassSymbols(code: string): ClassSymbol[] {
  const symbols = extractor["extractFromFile"]("test.ts", code, testNamespace);
  return symbols.filter((s) => s.type === "class") as ClassSymbol[];
}

function extractTypeSymbols(code: string): TypeSymbol[] {
  const symbols = extractor["extractFromFile"]("test.ts", code, testNamespace);
  return symbols.filter((s) => s.type === "type") as TypeSymbol[];
}

function extractFunctionSymbols(code: string): FunctionSymbol[] {
  const symbols = extractor["extractFromFile"]("test.ts", code, testNamespace);
  return symbols.filter((s) => s.type === "function") as FunctionSymbol[];
}

describe("typescript-symbol-extractor", () => {
  describe("ClassSymbol", () => {
    it("should extract a class", () => {
      const code = `export class MyClass {}`;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyClass");
      expect(symbol?.type).toBe("class");
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
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
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
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
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
      expect(symbol?.meta.constructorArgs).toHaveLength(0);
      expect(symbol?.meta.properties).toHaveLength(0);
      expect(symbol?.meta.methods).toHaveLength(2);
      expect(symbol?.meta.methods[0]).toMatchObject({
        name: "myMethod",
        parameters: [],
        visibility: "public",
        returnType: "void",
        isStatic: false,
        isAsync: false,
        line: 2,
        comments: null,
      });
      expect(symbol?.meta.methods[0].content).toContain("myMethod");
      expect(symbol?.meta.methods[1]).toMatchObject({
        name: "privateAsyncMethod",
        parameters: [],
        visibility: "private",
        returnType: "void",
        isStatic: false,
        isAsync: true,
        line: 3,
        comments: null,
      });
      expect(symbol?.meta.methods[1].content).toContain("privateAsyncMethod");
    });

    it("should extract a class with method comments", () => {
      const code = `
        export class MyClass {
          /**
           * This method does something important
           * @deprecated Use newMethod instead
           */
          public myMethod(): void {}
          
          // Simple comment
          public anotherMethod(): void {}
        }
      `;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.meta.methods).toHaveLength(2);
      expect(symbol?.meta.methods[0].comments).toContain("@deprecated");
      expect(symbol?.meta.methods[0].comments).toContain("This method does something important");
      expect(symbol?.meta.methods[1].comments).toContain("Simple comment");
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
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
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

    it("should extract a deprecated class", () => {
      const code = `
      /**
       * @deprecated This class is deprecated, use NewClass instead
       */
      export class MyClass {}`;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyClass");
      expect(symbol?.type).toBe("class");
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(true);
      expect(symbol?.comments).toContain("@deprecated");
    });
  });

  describe("TypeSymbol", () => {
    it("should extract a type", () => {
      const code = `export type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyType");
      expect(symbol?.type).toBe("type");
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
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
      expect(symbol1?.namespace).toBe(testNamespace);
      expect(symbol1?.deprecated).toBe(false);
      expect(symbol1?.meta.kind).toBe("type");

      expect(symbol2).toBeDefined();
      expect(symbol2?.name).toBe("MyOtherType");
      expect(symbol2?.type).toBe("type");
      expect(symbol2?.namespace).toBe(testNamespace);
      expect(symbol2?.deprecated).toBe(false);
      expect(symbol2?.meta.kind).toBe("type");
    });
    it("should extract a type with a definition", () => {
      const code = `export type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
    });
    it("should extract an interface", () => {
      const code = `export interface MyInterface {}`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyInterface");
      expect(symbol?.type).toBe("type");
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
      expect(symbol?.meta.kind).toBe("interface");
    });
    it("should extract an enum", () => {
      const code = `export enum MyEnum {}`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyEnum");
      expect(symbol?.type).toBe("type");
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(false);
      expect(symbol?.meta.kind).toBe("enum");
    });
    it("should not extract a type that is not exported", () => {
      const code = `type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeUndefined();
    });

    it("should extract a deprecated type", () => {
      const code = `
      /**
       * @deprecated Use NewType instead
       */
      export type MyType = string;`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("MyType");
      expect(symbol?.type).toBe("type");
      expect(symbol?.namespace).toBe(testNamespace);
      expect(symbol?.deprecated).toBe(true);
      expect(symbol?.comments).toContain("@deprecated");
    });
  });

  it("should extract a function with complex types", () => {
    const code = `
    function deleteUserIdMapping(input: {
        userId: string;
        userIdType?: "SUPERTOKENS" | "EXTERNAL" | "ANY";
        force?: boolean;
        userContext?: Record<string, any>;
    }) {
        return SuperTokens.getInstanceOrThrowError().deleteUserIdMapping({
            ...input,
            userContext: getUserContext(input.userContext),
        });
    }
`;

    const [symbol] = extractFunctionSymbols(code);
    expect(symbol).toBeDefined();
    expect(symbol?.name).toBe("deleteUserIdMapping");
    expect(symbol?.type).toBe("function");
    expect(symbol?.namespace).toBe(testNamespace);
    expect(symbol?.meta.parameters).toHaveLength(1);
    expect(symbol?.meta.parameters[0].name).toBe("input");
    // prettier-ignore
    expect(symbol?.meta.parameters[0].type).toBe(`{ userId: string; userIdType?: "SUPERTOKENS" | "EXTERNAL" | "ANY"; force?: boolean; userContext?: Record<string, any>; }`);
  });
});
