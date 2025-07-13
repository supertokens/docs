export interface SymbolExtractor {
  language: "typescript" | "go" | "python";
  include: string[];
  exclude: string[];
  extract(rootPath: string): void;
}

export interface Symbol {
  name: string;
  type: "variable" | "function" | "class" | "type" | "method";
  file: string;
  line: number;
  content: string;
  comments: string | null;
  meta: Record<string, unknown>;
}

export interface VariableSymbol extends Symbol {
  type: "variable";
  meta: {
    dataType: string;
    isConst: boolean;
    initialValue?: string;
  };
}

export interface FunctionSymbol extends Symbol {
  type: "function";
  meta: {
    parameters: Array<{ name: string; type: string; optional?: boolean }>;
    returnType: string;
    isAsync: boolean;
    isStatic?: boolean;
  };
}

export interface ClassSymbol extends Symbol {
  type: "class";
  meta: {
    methods: {
      name: string;
      parameters: Array<{ name: string; type: string; optional?: boolean }>;
      visibility: "public" | "private" | "protected";
      returnType: string;
      isStatic: boolean;
      isAsync: boolean;
      line: number;
    }[];
    properties: {
      name: string;
      visibility: "public" | "private" | "protected";
      type?: string;
      isStatic: boolean;
      initialValue?: string;
      line: number;
    }[];
    constructorArgs: Array<{ name: string; type: string; optional: boolean }>;
  };
}

export interface TypeSymbol extends Symbol {
  type: "type";
  meta: {
    definition: string;
    kind: "interface" | "type" | "enum" | "alias";
  };
}
