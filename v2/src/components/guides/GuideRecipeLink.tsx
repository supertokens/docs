import React, { useContext, useMemo } from "react";
import { GuidePageContext } from "./GuidePageContext";

export function GuideRecipeLink({
  link,
  children,
}: React.PropsWithChildren<{ link: string }>) {
  const { guide } = useContext(GuidePageContext);

  const fullLink = useMemo(() => {
    let linkPrefix = `/docs/${guide.authMethod}`;
    if (guide.authMethod === "multi-tenant") linkPrefix = "/docs/multitenancy";
    if (guide.authMethod === "all-auth")
      linkPrefix = "/docs/thirdpartyemailpassword";
    return `${linkPrefix}/${link}`;
  }, [guide, link]);

  return <a href={fullLink}>{children}</a>;
}
