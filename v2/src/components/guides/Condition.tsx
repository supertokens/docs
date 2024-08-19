import React from "react";
import { Selection } from "./utils";
import { GuidePageContext } from "./GuidePageContext";
import CodeBlock from "../../theme/CodeBlock";

type EnhancedSelection = Selection & {
  recipesVisiblity: {
    emailPassword: boolean;
    mta: boolean;
    mfa: boolean;
    passwordless: boolean;
    thirdparty: boolean;
  };
  isMobile: boolean;
  hasExampleApp: boolean;
};

// TODO:
// Talk about creating multiple pages
// instead of having conditions all over the place
// It will be easier to maintain and improve in the future

export const Condition = (
  props: React.PropsWithChildren<{
    match: boolean | ((selection: EnhancedSelection) => boolean);
    title?: string;
  }>,
) => {
  const { children, title, match } = props;
  const { selection, showOnlySelected } = React.useContext(GuidePageContext);
  const enhancedSelection: EnhancedSelection = React.useMemo(() => {
    return {
      ...selection,
      isMobile: ["react-native", "ios", "android", "flutter"].includes(
        selection.frontend,
      ),
      hasExampleApp: !selection.applicationServer,
      recipesVisiblity: {
        emailPassword: [
          "emailpassword",
          "thirdpartyemailpassword",
          "all-auth",
          "mfa",
          "multi-tenant",
        ].includes(selection.selectedAuthMethod),
        mta: selection.selectedAuthMethod === "multi-tenant",
        mfa:
          selection.selectedAuthMethod === "mfa" ||
          selection.selectedAuthMethod === "multi-tenant",
        passwordless: [
          "passwordless",
          "thirdpartypasswordless",
          "all-auth",
          "mfa",
          "multi-tenant",
        ].includes(selection.selectedAuthMethod),
        thirdparty: [
          "thirdparty",
          "thirdpartyemailpassword",
          "thirdpartypasswordless",
          "all-auth",
          "mfa",
          "multi-tenant",
        ].includes(selection.selectedAuthMethod),
      },
    };
  }, [selection]);

  const matchesCondition =
    typeof match === "function" ? match(enhancedSelection) : match;

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
