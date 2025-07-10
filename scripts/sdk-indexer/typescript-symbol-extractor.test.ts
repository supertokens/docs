import { describe, it, expect } from "vitest";
import { TypeScriptSymbolExtractor } from "./typescript-symbol-extractor";
import { ClassSymbol } from "./types";

const extractor = new TypeScriptSymbolExtractor();

function extractClassSymbols(code: string): ClassSymbol[] {
  const symbols = extractor["extractFromFile"]("test.ts", code);
  return symbols.filter((s) => s.type === "class") as ClassSymbol[];
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
      console.log(symbol);
      console.log(symbol?.meta.properties);
      expect(symbol).toBeDefined();
      expect(symbol?.meta.properties).toHaveLength(3);
      expect(symbol?.meta.properties.map((p) => p.name)).toEqual(expect.arrayContaining(["prop1", "prop2", "prop3"]));
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
      expect(symbol?.meta.methods).toHaveLength(2);
      expect(symbol?.meta.methods.map((m) => m.name)).toEqual(
        expect.arrayContaining(["myMethod", "privateAsyncMethod"]),
      );
      const myMethod = symbol?.meta.methods.find((m) => m.name === "myMethod");
      expect(myMethod?.isAsync).toBe(false);
      const privateAsyncMethod = symbol?.meta.methods.find((m) => m.name === "privateAsyncMethod");
      expect(privateAsyncMethod?.isAsync).toBe(true);
    });

    it("should extract a class with constructor arguments", () => {
      const code = `
        export class MyClass {
          constructor(param1: string, private param2: number) {}
        }
      `;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.meta.constructorArgs).toHaveLength(2);
      expect(symbol?.meta.constructorArgs[0].name).toBe("param1");
      expect(symbol?.meta.constructorArgs[0].type).toBe("string");
      expect(symbol?.meta.constructorArgs[1].name).toBe("param2");
      expect(symbol?.meta.constructorArgs[1].type).toBe("number");
    });

    it("should not extract a class that is not exported", () => {
      const code = `class MyClass {}`;
      const [symbol] = extractClassSymbols(code);
      expect(symbol).toBeUndefined();
    });
  });
});

