import { InferDotNotationKeys, InferDotNotationValue } from "./types";

// TODO: Move all external store values this store
export interface DocPageState {
  nextjsRouterType: "app-router" | "pages-router";
  accountType: "managed" | "self-hosted";
  selfHostedDeploymentType: "with-docker" | "without-docker";
  tenantType: "single-tenant" | "multi-tenant";
}

class DocPageStore {
  private state: DocPageState;
  private listeners: Set<() => void>;

  constructor() {
    this.state = {
      tenantType: "single-tenant",
      nextjsRouterType: "app-router",
      accountType: "managed",
      selfHostedDeploymentType: "with-docker",
    };
    this.listeners = new Set();
  }

  public getSnapshot() {
    return this.state;
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  updateValue<T extends InferDotNotationKeys<DocPageState>, K extends InferDotNotationValue<DocPageState, T>>(
    key: T,
    value: K,
  ) {
    const newState = { ...this.state };
    setObjectProperty(newState, key, value);
    this.state = newState;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

export const docPageStore = new DocPageStore();

function setObjectProperty(obj: object, key: string, value: unknown) {
  const keys = key.split(".");
  if (typeof obj !== "object" || obj === null) {
    throw new TypeError("First argument must be a non-null object");
  }
  let current = obj;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (i === keys.length - 1) {
      current[key] = value;
    } else if (!(key in current)) {
      current[key] = {};
    }
    current = current[key];
  }
}
