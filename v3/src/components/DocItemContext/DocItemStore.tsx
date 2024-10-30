import React, { useSyncExternalStore } from "react";

export type DocsItemStateType = {
  authenticationRecipes: {
    emailpassword: {};
    passwordless: {
      contactMethod: "EMAIL" | "PHONE" | "EMAIL_OR_PHONE";
      flowType:
        | "USER_INPUT_CODE_AND_MAGIC_LINK"
        | "USER_INPUT_CODE"
        | "MAGIC_LINK";
    };
    thirdparty: {};
  };
  uiType: "prebuilt" | "custom";
  appSetup: "single-tenant" | "multi-tenant";
  frontend: {
    type: "web" | "mobile";
    framework:
      | "reactjs"
      | "nextjs"
      | "angular"
      | "vue"
      | "vanillajs"
      | "mobile";
    settings: Record<string, unknown>;
  };
  backend: {
    language: "node" | "go" | "python";
    framework?: "express" | "fastify" | "hapi" | "koa" | "loopback";
  };
  appInfo: {
    appName: string;
    apiDomain: string;
    apiBasePath: string;
    websiteDomain: string;
    websiteBasePath: string;
  };
};

const DefaultState: DocsItemStateType = {
  authenticationRecipes: {
    emailpassword: {},
    passwordless: {
      contactMethod: "EMAIL",
      flowType: "MAGIC_LINK",
    },
    thirdparty: {},
  },
  uiType: "prebuilt",
  appSetup: "single-tenant",
  frontend: {
    type: "web",
    framework: "reactjs",
    settings: { usesReactRouter: true, reactRouterVersion: ">=v6" },
  },
  backend: {
    language: "node",
    framework: "express",
  },
  appInfo: {
    appName: "",
    apiDomain: "https://try.supertokens.com",
    apiBasePath: "/",
    websiteDomain: "https://try.supertokens.com",
    websiteBasePath: "/",
  },
};

let isInitialized = false;
let DocsItemState = DefaultState;

const LOCAL_STORAGE_KEY = "docs-item-context";

const subscribers = new Set<() => void>();

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const getSnapshot = () => {
  if (isInitialized) return DocsItemState;
  const localStorageState = localStorage.getItem(LOCAL_STORAGE_KEY);
  try {
    const initialState = JSON.parse(localStorageState);
    if (!!initialState) return initialState;
  } catch (e) {
    console.error(e);
    return DefaultState;
  } finally {
    isInitialized = true;
  }
};

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export function useDocsItemStore() {
  const set = (value: DocsItemStateType) => {
    DocsItemState = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    notifySubscribers();
  };

  const store = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => DefaultState,
  );

  return [store, set];
}
