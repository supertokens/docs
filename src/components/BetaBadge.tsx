import React from "react";
import { Badge } from "@radix-ui/themes";

const BetaPages = ["/docs/authentication/ai-authentication"];
const BetaCategories = [];

type BetaBadgeProps =
  | {
      label: string;
      className?: string;
    }
  | {
      href: string;
      className?: string;
    };

export function BetaBadge(props: BetaBadgeProps) {
  const href = "href" in props ? props.href : undefined;
  const label = "label" in props ? props.label : undefined;

  const shouldShow = href ? BetaPages.includes(href) : BetaCategories.includes(label);

  if (!shouldShow) {
    return null;
  }

  return (
    <span style={{ marginLeft: "auto" }} className={props.className}>
      <Badge variant="outline" color="blue" size="1" radius="small">
        Beta
      </Badge>
    </span>
  );
}

export default BetaBadge;
