import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type DocsItemState = {
  authenticationRecipes: {
    emailpassword: {
      enabled: boolean;
      settings: {};
    };
    passwordless: {
      enabled: boolean;
      settings: {
        contactMethod: "EMAIL" | "PHONE" | "EMAIL_OR_PHONE";
        flowType:
          | "USER_INPUT_CODE_AND_MAGIC_LINK"
          | "USER_INPUT_CODE"
          | "MAGIC_LINK";
      };
    };
    thirdparty: {
      enabled: boolean;
      settings: {};
    };
  };
  uiType: "prebuilt" | "custom";
  appSetup: "single" | "multi";
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

type DocsItemContextType = DocsItemState & {
  onChangeFrontendType: (type: DocsItemState["frontend"]["type"]) => void;
  onChangeFrontendFramework: (
    type: DocsItemState["frontend"]["framework"],
  ) => void;
  onChangeUIType: (type: DocsItemState["uiType"]) => void;
  onToggleAuthenticationRecipe: (
    recipeName: keyof DocsItemState["authenticationRecipes"],
  ) => void;
  onChangeRecipeSettings: (
    recipeName: keyof DocsItemState["authenticationRecipes"],
    propertyName: string,
    propertyValue: unknown,
  ) => void;
  onChangeFrontendSettings: (
    settings: DocsItemState["frontend"]["settings"],
  ) => void;
  onChangeAppInfoField: (fieldName: string, value: string) => void;
  derived: {
    frontendRecipeInitCode: string;
  };
};

export const DocsItemContext = createContext<DocsItemContextType>(
  {} as DocsItemContextType,
);

const DefaultState: DocsItemState = {
  authenticationRecipes: {
    emailpassword: {
      enabled: true,
      settings: {},
    },
    passwordless: {
      enabled: false,
      settings: {
        contactMethod: "EMAIL",
        flowType: "MAGIC_LINK",
      },
    },
    thirdparty: {
      enabled: false,
      settings: {},
    },
  },
  uiType: "prebuilt",
  appSetup: "single",
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

const LOCAL_STORAGE_KEY = "docs-item-context";

export function DocsItemContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer<
    React.Reducer<DocsItemState, DocsItemStateAction>
  >(docsStateReducer, DefaultState);

  const onChangeFrontendType = useCallback(
    (type: DocsItemState["frontend"]["type"]) => {
      dispatch({
        type: "change-frontend-type",
        payload: type,
      });
    },
    [],
  );

  const onChangeFrontendFramework = useCallback(
    (type: DocsItemState["frontend"]["framework"]) => {
      dispatch({
        type: "change-frontend-framework",
        payload: type,
      });
    },
    [],
  );

  const onChangeUIType = useCallback((type: DocsItemState["uiType"]) => {
    dispatch({
      type: "change-ui-type",
      payload: type,
    });
  }, []);

  const onToggleAuthenticationRecipe = useCallback(
    (recipeName: keyof DocsItemState["authenticationRecipes"]) => {
      dispatch({
        type: "toggle-authentication-recipe",
        payload: recipeName,
      });
    },
    [],
  );

  const onChangeAppInfoField = useCallback(
    (fieldName: string, value: string) => {
      dispatch({
        type: "change-appInfo-field",
        payload: {
          fieldName,
          value,
        },
      });
    },
    [],
  );

  const onChangeFrontendSettings = useCallback(
    (settings: DocsItemState["frontend"]["settings"]) => {
      dispatch({
        type: "change-frontend-settings",
        payload: settings,
      });
    },
    [],
  );

  const derived = useMemo(() => {
    const frontendRecipeInitCode = [];
    const { authenticationRecipes } = state;
    if (authenticationRecipes.emailpassword.enabled) {
      frontendRecipeInitCode.push(`EmailPassword.init(),`);
    }
    if (authenticationRecipes.thirdparty.enabled) {
      frontendRecipeInitCode.push(`ThirdParty.init(),`);
    }
    if (authenticationRecipes.passwordless.enabled) {
      frontendRecipeInitCode.push(`Passwordless.init(),`);
    }

    return {
      frontendRecipeInitCode: frontendRecipeInitCode.join("\n"),
    };
  }, [state]);

  const onChangeRecipeSettings = useCallback(
    (
      recipeName: keyof DocsItemState["authenticationRecipes"],
      propertyName: string,
      propertyValue: unknown,
    ) => {
      dispatch({
        type: "change-recipe-settings",
        payload: {
          propertyName,
          propertyValue,
          recipeName,
        },
      });
    },
    [],
  );

  return (
    <DocsItemContext.Provider
      value={{
        ...state,
        onChangeFrontendType,
        onChangeUIType,
        onToggleAuthenticationRecipe,
        onChangeRecipeSettings,
        onChangeAppInfoField,
        onChangeFrontendFramework,
        onChangeFrontendSettings,
        derived,
      }}
    >
      {children}
    </DocsItemContext.Provider>
  );
}

type DocsItemStateAction =
  | {
      type: "change-frontend-type";
      payload: DocsItemState["frontend"]["type"];
    }
  | {
      type: "change-ui-type";
      payload: DocsItemState["uiType"];
    }
  | {
      type: "toggle-authentication-recipe";
      payload: keyof DocsItemState["authenticationRecipes"];
    }
  | {
      type: "change-frontend-framework";
      payload: DocsItemState["frontend"]["framework"];
    }
  | {
      type: "change-appInfo-field";
      payload: { fieldName: string; value: string };
    }
  | {
      type: "change-recipe-settings";
      payload: {
        propertyName: string;
        propertyValue: unknown;
        recipeName: keyof DocsItemState["authenticationRecipes"];
      };
    }
  | {
      type: "change-frontend-settings";
      payload: DocsItemState["frontend"]["settings"];
    };

const docsStateReducer = (
  state: DocsItemState,
  action: DocsItemStateAction,
): DocsItemState => {
  switch (action.type) {
    case "change-frontend-type":
      return {
        ...state,
        frontend: {
          ...state.frontend,
          type: action.payload,
        },
      };
    case "change-ui-type":
      return {
        ...state,
        uiType: action.payload,
      };
    case "change-frontend-framework":
      return {
        ...state,
        frontend: {
          type: action.payload === "mobile" ? "mobile" : "web",
          framework: action.payload,
          settings: {},
        },
      };
    case "toggle-authentication-recipe":
      return {
        ...state,
        authenticationRecipes: {
          ...state.authenticationRecipes,
          [action.payload]: {
            ...state.authenticationRecipes[action.payload],
            enabled: !state.authenticationRecipes[action.payload].enabled,
          },
        },
      };
    case "change-recipe-settings":
      return {
        ...state,
        authenticationRecipes: {
          ...state.authenticationRecipes,
          [action.payload.recipeName]: {
            ...state.authenticationRecipes[action.payload.recipeName],
            settings: {
              ...state.authenticationRecipes[action.payload.recipeName]
                .settings,
              [action.payload.propertyName]: action.payload.propertyValue,
            },
          },
        },
      };
    case "change-frontend-settings":
      return {
        ...state,
        frontend: {
          ...state.frontend,
          settings: action.payload,
        },
      };
    case "change-appInfo-field":
      return {
        ...state,
        appInfo: {
          ...state.appInfo,
          [action.payload.fieldName]: action.payload.value,
        },
      };
  }
};

// TODO: Temp method used to render context values
// until I find the actual way to extend the mdx context
export function ContextValue({ property }: { property: string }) {
  const state = useContext(DocsItemContext);

  return <>{getObjectWithDotNotationKey(state, property)}</>;
}

export function ContextValueReplacer({ children }) {
  const state = useContext(DocsItemContext);

  const replaceVariables = (content) => {
    const regex = /\^\{([^\}]*)\}/g;
    const matches = [...content.matchAll(regex)];
    if (matches.length === 0) return content;
    let replacedContent = content;
    matches.forEach((match) => {
      const fullMatch = match[0];
      const variableName = match[1];
      if (!variableName) return replacedContent;
      if (variableName.startsWith("coreInjector")) return replacedContent;
      const value = getObjectWithDotNotationKey(state, variableName);
      replacedContent = replacedContent.replace(fullMatch, value);
    });

    const commentRegex =
      /<!--\s*start-condition\s+([\w.]+)\s*-->([\s\S]*?)<!--\s*end-condition\s*-->/g;

    replacedContent = replacedContent.replace(
      commentRegex,
      (match, key, content) => {
        const value = getObjectWithDotNotationKey(state, key);
        if (!value) return "";

        return content.trim();
      },
    );

    const trimBlockRegex =
      /<!--\s*start-trim-block\s*-->([\s\S]*?)<!--\s*end-trim-block\s*-->/g;
    return replacedContent.replace(trimBlockRegex, (match, content) => {
      return content.trim();
    });
  };

  const processedChildren = recursiveMapChildren(children, (child) => {
    if (typeof child === "string") {
      return replaceVariables(child);
    }
    return child;
  });

  return processedChildren;
}

const recursiveMapChildren = (children, mapFunc) => {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child) && child) {
      return mapFunc(child);
    }

    if (child.props.children) {
      child = React.cloneElement(child, {
        children: recursiveMapChildren(child.props.children, mapFunc),
      });
    }

    return child;
  });
};

function getObjectWithDotNotationKey(
  obj: Record<string, unknown>,
  key: string,
  log = false,
): unknown {
  if (!key) return "";
  if (!obj) return "";
  const keys = key.split(".");
  let current = obj;

  if (keys.length === 1) return obj[keys[0]];

  // @ts-expect-error
  current = current[keys[0]];
  return getObjectWithDotNotationKey(current, keys.slice(1).join("."), log);
}

export function ContextCondition({
  condition,
  children,
}: {
  condition: (state: DocsItemState) => boolean;
  children: React.ReactNode;
}) {
  const state = useContext(DocsItemContext);
  const matches = condition(state);

  if (!matches) return null;
  return <>{children}</>;
}
