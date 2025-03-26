import React, { useSyncExternalStore } from "react";

export type DocsItemStateType = {
  recipes: {
    emailpassword: {};
    passwordless: {
      contactMethod: "EMAIL" | "PHONE" | "EMAIL_OR_PHONE";
      flowType: "USER_INPUT_CODE_AND_MAGIC_LINK" | "USER_INPUT_CODE" | "MAGIC_LINK";
    };
    thirdparty: {};
  };
  uiType: "prebuilt" | "custom";
  appInfo: {
    appName: string;
    apiDomain: string;
    apiBasePath: string;
    websiteDomain: string;
    websiteBasePath: string;
  };
  appType: "single" | "multi";
  tenantType: "single" | "multi";
  coreInfo: {
    hasSupertokensSession: boolean;
    uri: string | null;
    key: string | null;
  };
};

const DefaultState: DocsItemStateType = {
  recipes: {
    emailpassword: {},
    passwordless: {
      contactMethod: "PHONE",
      flowType: "MAGIC_LINK",
    },
    thirdparty: {},
  },
  uiType: "prebuilt",
  tenantType: "single",
  appType: "single",
  appInfo: {
    appName: "",
    apiDomain: "",
    apiBasePath: "/auth",
    websiteDomain: "",
    websiteBasePath: "/auth",
  },
  coreInfo: {
    hasSupertokensSession: false,
    uri: "<CORE_API_ENDPOINT>",
    key: "<YOUR_API_KEY>",
  },
};

let isInitialized = false;
let DocsItemState = DefaultState;

const LOCAL_STORAGE_KEY = "page-dynamic-values";

const subscribers = new Set<() => void>();

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => subscribers.delete(callback);
};

const getSnapshot = () => {
  if (isInitialized) return DocsItemState;
  const localStorageState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!localStorageState) {
    isInitialized = true;
    DocsItemState = DefaultState;
    return DocsItemState;
  }
  try {
    const initialState = JSON.parse(localStorageState);
    if (!!initialState) {
      DocsItemState = initialState;
      return DocsItemState;
    }
  } catch (e) {
    console.error(e);
    DocsItemState = DefaultState;
    return DocsItemState;
  } finally {
    isInitialized = true;
  }
};

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export function useDocsItemStore(): [DocsItemStateType, (state: DocsItemStateType) => void] {
  const set = (value: DocsItemStateType) => {
    DocsItemState = value;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value));
    notifySubscribers();
  };

  const store = useSyncExternalStore(subscribe, getSnapshot, () => DefaultState);

  return [store as DocsItemStateType, set];
}
