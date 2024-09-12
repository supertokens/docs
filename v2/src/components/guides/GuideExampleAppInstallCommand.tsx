import React, { useContext, useMemo } from "react";
import CodeBlock from "@theme/CodeBlock";
import { GuidePageContext } from "./GuidePageContext";

export function GuideExampleAppInstallCommand() {
  const { guide } = useContext(GuidePageContext);

  const frontend = useMemo(() => {
    if (guide.frontend === "nextjs") return "next";
    return guide.frontend;
  }, [guide]);

  const backend = useMemo(() => {
    if (guide.backend === "nodejs" && guide.backendFramework === "express")
      return "node";
    if (guide.backend === "nodejs" && guide.backendFramework === "nestjs")
      return "nest";
    if (guide.backend === "python" && guide.backendFramework === "flask")
      return "python-flask";
    if (guide.backend === "python" && guide.backendFramework === "fastapi")
      return "python-fastapi";
    if (guide.backend === "python" && guide.backendFramework === "django")
      return "python-drf";
    return guide.backend;
  }, [guide]);

  const recipe = useMemo(() => {
    if (guide.authMethod === "all-auth") return "all_auth";
    if (guide.authMethod === "multi-tenant") return "multitenancy";
    if (guide.authMethod === "mfa") return "multifactorauth";
    return guide.authMethod;
  }, [guide]);

  if (guide.frontend === "nextjs" && guide.backend === "nextjs") {
    const command = `npx create-supertokens-app@latest --recipe=${recipe} --frontend=${frontend}`;
    return <CodeBlock language="bash">{command}</CodeBlock>;
  }

  const command = `npx create-supertokens-app@latest --recipe=${recipe} --frontend=${frontend} --backend=${backend}`;
  return <CodeBlock language="bash">{command}</CodeBlock>;
}
