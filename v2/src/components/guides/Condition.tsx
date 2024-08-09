import React from "react";
import { Selection } from "./utils";
import { GuidePageContext } from "./GuidePageContext";
import CodeBlock from "../../theme/CodeBlock";

export const Condition = (
  props: React.PropsWithChildren<{
    match: boolean | ((selection: Selection) => boolean);
    title?: string;
  }>,
) => {
  const { children, title, match } = props;
  const { selection, showOnlySelected } = React.useContext(GuidePageContext);

  const matchesCondition =
    typeof match === "function" ? match(selection) : match;

  if (!showOnlySelected && typeof match === "function") {
    return (
      <>
        <h3 style={{ color: "#dcd50e" }}>{`{If ${title}}`}</h3>
        <CodeBlock className="language-tsx">{match.toString()}</CodeBlock>
        {children}
        <h3 style={{ color: "#dcd50e" }}>{`{EndIf ${title}}`}</h3>
      </>
    );
  }
  return matchesCondition ? children : null;
};
