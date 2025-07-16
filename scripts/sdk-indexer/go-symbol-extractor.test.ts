import { describe, it, expect } from "vitest";
import { GoSymbolExtractor } from "./go-symbol-extractor";
import { FunctionSymbol, TypeSymbol } from "./types";

const extractor = new GoSymbolExtractor();

function extractFunctionSymbols(code: string): FunctionSymbol[] {
  const symbols = extractor["extractFromFile"]("test.go", code);
  return symbols.filter((s) => s.type === "function") as FunctionSymbol[];
}

function extractTypeSymbols(code: string): TypeSymbol[] {
  const symbols = extractor["extractFromFile"]("test.go", code);
  return symbols.filter((s) => s.type === "type") as TypeSymbol[];
}

describe("go-symbol-extractor", () => {
  describe("FunctionSymbol", () => {
    it("should extract a simple function", () => {
      const code = `
package main

func Hello() {
}
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Hello");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("void");
      expect(symbol?.meta.parameters).toHaveLength(0);
      expect(symbol?.meta.isAsync).toBe(false);
      expect(symbol?.meta.isStatic).toBe(true);
    });

    it("should extract a function with parameters", () => {
      const code = `
package main

func Add(a int, b int) int {
    return a + b
}
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Add");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("int");
      expect(symbol?.meta.parameters).toHaveLength(2);
      expect(symbol?.meta.parameters).toEqual([
        {
          name: "a",
          type: "int",
          optional: false,
        },
        {
          name: "b",
          type: "int",
          optional: false,
        },
      ]);
    });

    it("should extract a function with multiple return types", () => {
      const code = `
package main

func Divide(a int, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("division by zero")
    }
    return a / b, nil
}
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Divide");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("(int, error)");
      expect(symbol?.meta.parameters).toHaveLength(2);
    });

    it("should extract a function with pointer parameters", () => {
      const code = `
package main

func Process(data *string) *int {
    return nil
}
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Process");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("*int");
      expect(symbol?.meta.parameters).toHaveLength(1);
      expect(symbol?.meta.parameters[0]).toEqual({
        name: "data",
        type: "*string",
        optional: false,
      });
    });

    it("should extract a method declaration", () => {
      const code = `
package main

type Person struct {
    Name string
}

func (p *Person) GetName() string {
    return p.Name
}
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("GetName");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("string");
      expect(symbol?.meta.isStatic).toBe(false); // methods are not static
    });

    it("should not extract unexported functions", () => {
      const code = `
package main

func hello() {
}

func Hello() {
}
`;
      const symbols = extractFunctionSymbols(code);
      expect(symbols).toHaveLength(1);
      expect(symbols[0]?.name).toBe("Hello");
    });

    it("should extract multiple functions", () => {
      const code = `
package main

func First() {
}

func Second() {
}

func Third() {
}
`;
      const symbols = extractFunctionSymbols(code);
      expect(symbols).toHaveLength(3);
      expect(symbols[0]?.name).toBe("First");
      expect(symbols[1]?.name).toBe("Second");
      expect(symbols[2]?.name).toBe("Third");
    });
  });

  describe("TypeSymbol", () => {
    it("should extract a simple type alias", () => {
      const code = `
package main

type UserID string
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("UserID");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("alias");
    });

    it("should extract a struct type", () => {
      const code = `
package main

type User struct {
    ID   int
    Name string
}
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("User");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("type");
    });

    it("should extract an interface type", () => {
      const code = `
package main

type Writer interface {
    Write([]byte) (int, error)
}
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Writer");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("interface");
    });

    it("should extract multiple types", () => {
      const code = `
package main

type UserID string

type User struct {
    ID   UserID
    Name string
}

type UserRepo interface {
    GetUser(id UserID) (*User, error)
}
`;
      const symbols = extractTypeSymbols(code);
      expect(symbols).toHaveLength(3);
      expect(symbols[0]?.name).toBe("UserID");
      expect(symbols[0]?.meta.kind).toBe("alias");
      expect(symbols[1]?.name).toBe("User");
      expect(symbols[1]?.meta.kind).toBe("type");
      expect(symbols[2]?.name).toBe("UserRepo");
      expect(symbols[2]?.meta.kind).toBe("interface");
    });

    it("should not extract unexported types", () => {
      const code = `
package main

type userID string

type User struct {
    ID   userID
    Name string
}
`;
      const symbols = extractTypeSymbols(code);
      expect(symbols).toHaveLength(1);
      expect(symbols[0]?.name).toBe("User");
    });

    it("should extract a type with definition", () => {
      const code = `
package main

type Status int

const (
    Active Status = iota
    Inactive
)
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Status");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("alias");
      expect(symbol?.meta.definition).toContain("type Status int");
    });
  });

  describe("Combined extraction", () => {
    it("should extract both functions and types from the same code", () => {
      const code = `
package main

type User struct {
    ID   int
    Name string
}

func NewUser(id int, name string) *User {
    return &User{ID: id, Name: name}
}

func (u *User) GetName() string {
    return u.Name
}

type UserRepo interface {
    GetUser(id int) (*User, error)
}
`;
      const allSymbols = extractor["extractFromFile"]("test.go", code);
      const functions = allSymbols.filter((s) => s.type === "function");
      const types = allSymbols.filter((s) => s.type === "type");
      
      expect(functions).toHaveLength(2);
      expect(types).toHaveLength(2);
      
      expect(functions[0]?.name).toBe("NewUser");
      expect(functions[1]?.name).toBe("GetName");
      expect(types[0]?.name).toBe("User");
      expect(types[1]?.name).toBe("UserRepo");
    });
  });
});