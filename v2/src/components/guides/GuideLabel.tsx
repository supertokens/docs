import React, { useContext, useMemo } from "react";
import { GuidePageContext } from "./GuidePageContext";

import { useLocation } from "@docusaurus/router";

export function GuideLabel({ type }: { type: GuideLabelType }) {
  const { selection } = useContext(GuidePageContext);
  const { pathname } = useLocation();

  const techStackString = useMemo(() => {
    return pathname.split("/").at(-1);
  }, [pathname]);

  const label = TechStackLabelsRecord[techStackString]?.[type];

  return label;
}

export enum GuideLabelType {
  frontend,
  backend,
}

const TechStackLabelsRecord: Record<string, Record<GuideLabelType, string>> = {
  "react-nodejs-express": {
    [GuideLabelType.frontend]: "React",
    [GuideLabelType.backend]: "Node.js/Express",
  },
};
