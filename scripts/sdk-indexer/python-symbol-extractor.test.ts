import { describe, it, expect } from "vitest";
import { PythonSymbolExtractor } from "./python-symbol-extractor";
import { FunctionSymbol, TypeSymbol } from "./types";

const extractor = new PythonSymbolExtractor();

function extractFunctionSymbols(code: string): FunctionSymbol[] {
  const symbols = extractor["extractFromFile"]("test.py", code);
  return symbols.filter((s) => s.type === "function") as FunctionSymbol[];
}

function extractTypeSymbols(code: string): TypeSymbol[] {
  const symbols = extractor["extractFromFile"]("test.py", code);
  return symbols.filter((s) => s.type === "type") as TypeSymbol[];
}

describe("python-symbol-extractor", () => {
  describe("FunctionSymbol", () => {
    it("should extract a simple function", () => {
      const code = `
def hello():
    pass
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("hello");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("None");
      expect(symbol?.meta.parameters).toHaveLength(0);
      expect(symbol?.meta.isAsync).toBe(false);
      expect(symbol?.meta.isStatic).toBe(false);
    });

    it("should extract a function with parameters", () => {
      const code = `
def add(a, b):
    return a + b
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("add");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("None");
      expect(symbol?.meta.parameters).toHaveLength(2);
      expect(symbol?.meta.parameters).toEqual([
        {
          name: "a",
          type: "Any",
          optional: false,
        },
        {
          name: "b",
          type: "Any",
          optional: false,
        },
      ]);
    });

    it("should extract a function with type annotations", () => {
      const code = `
def add(a: int, b: int) -> int:
    return a + b
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("add");
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

    it("should extract a function with default parameters", () => {
      const code = `
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("greet");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("str");
      expect(symbol?.meta.parameters).toHaveLength(2);
      expect(symbol?.meta.parameters).toEqual([
        {
          name: "name",
          type: "str",
          optional: false,
        },
        {
          name: "greeting",
          type: "str",
          optional: true,
        },
      ]);
    });

    it("should extract an async function", () => {
      const code = `
async def fetch_data(url: str) -> dict:
    # async implementation
    return {}
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("fetch_data");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("dict");
      expect(symbol?.meta.isAsync).toBe(true);
      expect(symbol?.meta.parameters).toHaveLength(1);
      expect(symbol?.meta.parameters[0]).toEqual({
        name: "url",
        type: "str",
        optional: false,
      });
    });

    it("should extract a static method", () => {
      const code = `
class Calculator:
    @staticmethod
    def add(a: int, b: int) -> int:
        return a + b
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("add");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("int");
      expect(symbol?.meta.isStatic).toBe(true);
    });

    it("should extract a function with complex type annotations", () => {
      const code = `
def process_data(data: List[Dict[str, Any]], limit: Optional[int] = None) -> Tuple[bool, str]:
    return True, "success"
`;
      const [symbol] = extractFunctionSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("process_data");
      expect(symbol?.type).toBe("function");
      expect(symbol?.meta.returnType).toBe("Tuple[bool, str]");
      expect(symbol?.meta.parameters).toHaveLength(2);
      expect(symbol?.meta.parameters).toEqual([
        {
          name: "data",
          type: "List[Dict[str, Any]]",
          optional: false,
        },
        {
          name: "limit",
          type: "Optional[int]",
          optional: true,
        },
      ]);
    });

    it("should not extract private functions", () => {
      const code = `
def _private_function():
    pass

def public_function():
    pass

def __dunder_method__(self):
    pass
`;
      const symbols = extractFunctionSymbols(code);
      expect(symbols).toHaveLength(2);
      expect(symbols[0]?.name).toBe("public_function");
      expect(symbols[1]?.name).toBe("__dunder_method__");
    });

    it("should extract multiple functions", () => {
      const code = `
def first():
    pass

def second():
    pass

def third():
    pass
`;
      const symbols = extractFunctionSymbols(code);
      expect(symbols).toHaveLength(3);
      expect(symbols[0]?.name).toBe("first");
      expect(symbols[1]?.name).toBe("second");
      expect(symbols[2]?.name).toBe("third");
    });
  });

  describe("TypeSymbol", () => {
    it("should extract a simple class", () => {
      const code = `
class User:
    def __init__(self, name: str):
        self.name = name
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("User");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("type");
    });

    it("should extract a class with inheritance", () => {
      const code = `
class Manager(User):
    def __init__(self, name: str, department: str):
        super().__init__(name)
        self.department = department
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Manager");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("type");
    });

    it("should extract an abstract base class", () => {
      const code = `
class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        pass
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Shape");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("interface");
    });

    it("should extract a protocol class", () => {
      const code = `
class Drawable(Protocol):
    def draw(self) -> None:
        ...
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Drawable");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("interface");
    });

    it("should extract an enum class", () => {
      const code = `
@enum.unique
class Color(Enum):
    RED = 1
    GREEN = 2
    BLUE = 3
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("Color");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("enum");
    });

    it("should extract multiple classes", () => {
      const code = `
class User:
    pass

class Product:
    pass

class Order:
    pass
`;
      const symbols = extractTypeSymbols(code);
      expect(symbols).toHaveLength(3);
      expect(symbols[0]?.name).toBe("User");
      expect(symbols[1]?.name).toBe("Product");
      expect(symbols[2]?.name).toBe("Order");
    });

    it("should not extract private classes", () => {
      const code = `
class _PrivateClass:
    pass

class PublicClass:
    pass
`;
      const symbols = extractTypeSymbols(code);
      expect(symbols).toHaveLength(1);
      expect(symbols[0]?.name).toBe("PublicClass");
    });

    it("should extract a class with definition", () => {
      const code = `
class DataClass:
    def __init__(self, value: int):
        self.value = value
    
    def get_value(self) -> int:
        return self.value
`;
      const [symbol] = extractTypeSymbols(code);
      expect(symbol).toBeDefined();
      expect(symbol?.name).toBe("DataClass");
      expect(symbol?.type).toBe("type");
      expect(symbol?.meta.kind).toBe("type");
      expect(symbol?.meta.definition).toContain("class DataClass:");
    });
  });

  describe("Combined extraction", () => {
    it("should extract both functions and classes from the same code", () => {
      const code = `
class User:
    def __init__(self, name: str):
        self.name = name
    
    def get_name(self) -> str:
        return self.name

def create_user(name: str) -> User:
    return User(name)

async def save_user(user: User) -> bool:
    # async save implementation
    return True

class UserRepository:
    def find_by_name(self, name: str) -> Optional[User]:
        return None
`;
      const allSymbols = extractor["extractFromFile"]("test.py", code);
      const functions = allSymbols.filter((s) => s.type === "function");
      const types = allSymbols.filter((s) => s.type === "type");
      
      expect(functions).toHaveLength(5);
      expect(types).toHaveLength(2);
      
      expect(functions[0]?.name).toBe("__init__");
      expect(functions[1]?.name).toBe("get_name");
      expect(functions[2]?.name).toBe("create_user");
      expect(functions[3]?.name).toBe("save_user");
      expect(functions[3]?.meta.isAsync).toBe(true);
      expect(functions[4]?.name).toBe("find_by_name");
      
      expect(types[0]?.name).toBe("User");
      expect(types[1]?.name).toBe("UserRepository");
    });
  });
});