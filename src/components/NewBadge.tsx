import React from "react";
import { Badge } from "@radix-ui/themes";

const NewPages = [
  "/docs/quickstart/build-with-ai-tools",
  "/docs/additional-verification/captcha",
  "/docs/post-authentication/user-management/user-banning",
  "/docs/authentication/enterprise/tenant-discovery",
  "/docs/deployment/telemetry",
  "/docs/post-authentication/user-management/progressive-profiling",
];
const NewCategories = ["Plugins"];

type NewBadgeProps =
  | {
      label: string;
      className?: string;
    }
  | {
      href: string;
      className?: string;
    };

export function NewBadge(props: NewBadgeProps) {
  const href = "href" in props ? props.href : undefined;
  const label = "label" in props ? props.label : undefined;

  const shouldShow = href ? NewPages.includes(href) : NewCategories.includes(label);

  if (!shouldShow) {
    return null;
  }

  return (
    <span style={{ marginLeft: "auto" }} className={props.className}>
      <Badge variant="outline" color="orange" size="1" radius="small">
        New
      </Badge>
    </span>
  );
}

export default NewBadge;
