import React, { createContext, useCallback, useEffect, useMemo } from "react";
import { DocsItemStateType, useDocsItemStore } from "@site/src/hooks";
import { getAuthReactURI, getWebJsURI } from "@site/src/lib/api";

type DocItemContextType = DocsItemStateType & {
  derived: Record<string, unknown>;
  webJsVersions: Record<string, string>;
  prebuiltUIVersion: string;
  onChangeTenantType: (type: DocsItemStateType["tenantType"]) => void;
  onChangeAppType: (type: DocsItemStateType["tenantType"]) => void;
  onChangeRecipeProperty: (
    recipeName: keyof DocsItemStateType["recipes"],
    propertyName: string,
    propertyValue: unknown,
  ) => void;
  onChangeAppInfoField: (fieldName: string, value: string) => void;
};

export const DocItemContext = createContext<DocItemContextType>({} as DocItemContextType);

export function DocItemContextProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useDocsItemStore();
  const [webJsVersions, setWebJsVersions] = React.useState<Record<string, string>>({});
  const [prebuiltUIVersion, setPrebuiltUIVersion] = React.useState<string>("");

  const onLoadWebJsVersions = useCallback(async () => {
    const result = await getWebJsURI();
    setWebJsVersions(result.uri);
  }, []);

  const onLoadPrebuiltUIVersion = useCallback(async () => {
    const result = await getAuthReactURI();
    setPrebuiltUIVersion(result.uri);
  }, []);

  useEffect(() => {
    onLoadWebJsVersions();
    onLoadPrebuiltUIVersion();
  }, []);

  const onChangeTenantType = useCallback(
    (type: DocsItemStateType["tenantType"]) => {
      setState({
        ...state,
        tenantType: type,
      });
    },
    [state],
  );

  const onChangeAppType = useCallback(
    (type: DocsItemStateType["appType"]) => {
      setState({
        ...state,
        appType: type,
      });
    },
    [state],
  );

  const onChangeAppInfoField = useCallback(
    (fieldName: string, value: string) => {
      setState({
        ...state,
        appInfo: {
          ...state.appInfo,
          [fieldName]: value,
        },
      });
    },
    [state],
  );

  const onChangeRecipeProperty = useCallback(
    (recipeName: keyof DocsItemStateType["recipes"], propertyName: string, propertyValue: unknown) => {
      setState({
        ...state,
        recipes: {
          ...state.recipes,
          [recipeName]: {
            ...state.recipes[recipeName],
            [propertyName]: propertyValue,
          },
        },
      });
    },
    [state],
  );

  const derivedState = useMemo(() => {
    let pythonContactMethodImport = "from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig";
    let pythonContactMethodMethod = "ContactEmailOnlyConfig";
    let goPasswordlessContactMethodMethod = "ContactMethodEmailConfig";
    if (state.recipes?.passwordless?.contactMethod === "PHONE") {
      pythonContactMethodImport = "from supertokens_python.recipe.passwordless import ContactPhoneOnlyConfig";
      pythonContactMethodMethod = "ContactPhoneOnlyConfig";
      goPasswordlessContactMethodMethod = "ContactMethodPhoneConfig";
    } else if (state.recipes?.passwordless?.contactMethod === "EMAIL_OR_PHONE") {
      pythonContactMethodImport = "from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig";
      pythonContactMethodMethod = "ContactEmailOrPhoneConfig";
      goPasswordlessContactMethodMethod = "ContactMethodEmailOrPhoneConfig";
    }
    return {
      appIdPathname: state.appType === "single" ? "" : `/appid-<APP_ID>`,
      pythonContactMethodImport,
      pythonContactMethodMethod,
      goPasswordlessContactMethodMethod,
    };
  }, [state]);

  const coreUri = useMemo(() => {
    return state.appType === "single" ? state.coreInfo.uri : `${state.coreInfo.uri}/appid-<APP_ID>`;
  }, [state]);

  return (
    <DocItemContext.Provider
      value={{
        ...state,
        webJsVersions,
        prebuiltUIVersion,
        coreInfo: {
          ...state.coreInfo,
          uri: coreUri,
        },
        derived: derivedState,
        onChangeAppType,
        onChangeTenantType,
        onChangeRecipeProperty,
        onChangeAppInfoField,
      }}
    >
      {children}
    </DocItemContext.Provider>
  );
}

export function getContextValue(obj: Record<string, unknown>, key: string, defaultValue?: unknown): unknown {
  if (!key) return "";
  if (!obj) {
    if (defaultValue) return defaultValue;
    return "";
  }
  const keys = key.split(".");
  let current = obj;

  if (keys.length === 1) {
    const value = obj[keys[0]];
    return value || defaultValue;
  }

  // @ts-expect-error
  current = current[keys[0]];
  return getContextValue(current, keys.slice(1).join("."), defaultValue);
}
