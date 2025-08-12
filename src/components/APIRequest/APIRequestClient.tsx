import { useCallback, useContext, forwardRef, ReactNode, useEffect, useMemo, useState, createContext } from "react";
import { APIRequestContext } from "./APIRequest";
import { useDocPageData, useLoadOpenApiDocument } from "@site/src/hooks";
import { ApiClientModalProvider, useApiClientModal } from "@scalar/api-client-react";

import type { OpenAPIV3 } from "@scalar/openapi-types";
import { Slot } from "@radix-ui/themes";
import { replaceVariablesForScalar, replaceVariablesInApiPath } from "@site/src/lib";

type ScalarContextType = {
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
};

const ScalarContext = createContext<ScalarContextType>({} as ScalarContextType);

function APIRequestClientProvider({ children }: { children: React.ReactNode }) {
  const { apiName, path, method } = useContext(APIRequestContext);
  const apiDocument = useLoadOpenApiDocument(apiName);
  const apiDomain = useDocPageData("apiDomain");
  const apiBasePath = useDocPageData("apiBasePath");
  const coreDomain = useDocPageData("coreDomain");
  const tenantId = useDocPageData("tenantId");
  const appId = useDocPageData("appId");

  const parsedApiDocument = useMemo(() => {
    if (!apiDocument) return null;

    return replaceVariablesForScalar(apiDocument, apiName, {
      apiDomain,
      apiBasePath,
      coreDomain,
      tenantId,
      appId,
    });
  }, [apiDocument, apiDomain, apiName, coreDomain, apiBasePath, tenantId, appId]);

  const parsedPath = useMemo(() => {
    return replaceVariablesInApiPath(path, { apiBasePath, tenantId, appId });
  }, [path, apiBasePath, tenantId, appId]);

  if (!apiDocument) return children;

  return (
    <ApiClientModalProvider
      configuration={{
        content: parsedApiDocument,
        showSidebar: false,
        proxyUrl: "https://proxy.scalar.com",
        theme: "default",
        persistAuth: false,
      }}
    >
      <ScalarContext.Provider value={{ path: parsedPath, method }}>{children}</ScalarContext.Provider>
    </ApiClientModalProvider>
  );
}

const APIRequestClientTrigger = forwardRef<HTMLElement, { children: ReactNode }>(
  function APIRequestClientTrigger(props, ref) {
    const { children } = props;
    const { path, method } = useContext(ScalarContext);
    const client = useApiClientModal();

    useEffect(() => {
      if (!client) return;
      const mountingEl = document.getElementById("docusaurus-scalar-root");
      client.mount(mountingEl);
    }, [client]);

    const onClick = useCallback(() => {
      client.open({ path, method });
    }, [client, path, method]);

    return (
      <Slot ref={ref} onClick={onClick}>
        {children}
      </Slot>
    );
  },
);

export const APIRequestClient = {
  Provider: APIRequestClientProvider,
  Trigger: APIRequestClientTrigger,
};
