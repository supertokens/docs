import React from "react";
import {
  GuidePageContext,
  Guide,
  MobileFrontendChoices,
} from "./GuidePageContext";

type ConditionGuide = Guide & {
  isEmailPasswordRecipeVisible: boolean;
  isMtaRecipeVisible: boolean;
  isMfaRecipeVisible: boolean;
  isPasswordlessRecipeVisible: boolean;
  isThirdPartyRecipeVisible: boolean;
  isMobile: boolean;
  hasExampleApp: boolean;
};

export const GuideCondition = (
  props: React.PropsWithChildren<{
    match: keyof ConditionGuide | ((selection: ConditionGuide) => boolean);
  }>,
) => {
  const { children, match } = props;
  const { guide, hasExampleApp } = React.useContext(GuidePageContext);
  const enhancedSelection: ConditionGuide = React.useMemo(() => {
    return {
      ...guide,
      isMobile: MobileFrontendChoices.includes(guide.frontend),
      hasExampleApp,
      isEmailPasswordRecipeVisible: [
        "emailpassword",
        "thirdpartyemailpassword",
        "all-auth",
        "multi-tenant",
      ].includes(guide.authMethod),
      isMtaRecipeVisible: guide.authMethod === "multi-tenant",
      isMfaRecipeVisible:
        guide.authMethod === "mfa" || guide.authMethod === "multi-tenant",
      isPasswordlessRecipeVisible: [
        "passwordless",
        "thirdpartypasswordless",
        "all-auth",
        "multi-tenant",
      ].includes(guide.authMethod),
      isThirdPartyRecipeVisible: [
        "thirdparty",
        "thirdpartyemailpassword",
        "thirdpartypasswordless",
        "all-auth",
        "multi-tenant",
      ].includes(guide.authMethod),
    };
  }, [guide]);

  const matchesCondition =
    typeof match === "function"
      ? match(enhancedSelection)
      : enhancedSelection[match];

  return matchesCondition ? children : null;
};
