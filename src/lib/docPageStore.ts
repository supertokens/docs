import { DOC_PAGE_STORE_DEFAULT_VALUES } from "./constants";
import { InferDotNotationKeys, InferDotNotationValue } from "./types";

export interface DocPageState {
  nextjsRouterType: "app-router" | "pages-router";
  accountType: "managed" | "self-hosted";
  selfHostedDeploymentType: "with-docker" | "without-docker";
  tenantType: "single-tenant" | "multi-tenant";
  apiRequestExampleLanguage: "shell" | "nodejs" | "python" | "go";
  uiType: "prebuilt" | "custom";
  apiDomain: string;
  apiBasePath: string;
  websiteDomain: string;
  websiteBasePath: string;
  tenantId: string;
  appId: string;
  tokenTransferMethod: "cookie" | "header";
  coreDomain: string;
}

class DocPageStore {
  private state: DocPageState;
  private listeners: Set<() => void>;

  constructor() {
    this.state = this.initState();
    this.listeners = new Set();
  }

  private persistToLocalStorage() {
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem("docPageState", JSON.stringify(this.state));
    }
  }

  private initState(): DocPageState {
    if (typeof window !== "undefined" && localStorage) {
      try {
        const state = JSON.parse(localStorage.getItem("docPageState"));
        if (state) return state;
      } catch (e) {
        console.error(e);
      }
    }
    return {
      tenantType: "single-tenant",
      nextjsRouterType: "app-router",
      accountType: "managed",
      uiType: "prebuilt",
      selfHostedDeploymentType: "with-docker",
      apiRequestExampleLanguage: "shell",
      apiDomain: DOC_PAGE_STORE_DEFAULT_VALUES.apiDomain,
      apiBasePath: DOC_PAGE_STORE_DEFAULT_VALUES.apiBasePath,
      websiteDomain: "{websiteDomain}",
      websiteBasePath: "/auth",
      tenantId: DOC_PAGE_STORE_DEFAULT_VALUES.tenantId,
      appId: DOC_PAGE_STORE_DEFAULT_VALUES.appId,
      coreDomain: DOC_PAGE_STORE_DEFAULT_VALUES.coreDomain,
      tokenTransferMethod: "cookie",
    };
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
    this.persistToLocalStorage();
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
