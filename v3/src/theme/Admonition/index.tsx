import React, { type ComponentType } from "react";
import { processAdmonitionProps } from "@docusaurus/theme-common";
import type { Props } from "@theme/Admonition";
import AdmonitionTypes from "@theme/Admonition/Types";

import ExclamationTriangleIcon from "/img/icons/exclamation-triangle.svg";
import InfoCircledIcon from "/img/icons/info-circled.svg";
import { Callout, Flex } from "@radix-ui/themes";

import "./admonition.scss";
type AdmonitionType = "info" | "note" | "tip" | "caution" | "danger" | "warning";

const AdmonitionTypeToIconRecord: Record<AdmonitionType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  info: InfoCircledIcon,
  note: InfoCircledIcon,
  tip: InfoCircledIcon,
  caution: ExclamationTriangleIcon,
  danger: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
};

type CalloutColor = React.ComponentProps<typeof Callout.Root>["color"];

const AdmonitionTypeToColorRecord: Record<AdmonitionType, CalloutColor> = {
  info: "blue",
  note: "gray",
  tip: "green",
  caution: "yellow",
  danger: "red",
  warning: "yellow",
};

export default function Admonition(unprocessedProps: Props): JSX.Element {
  const props = processAdmonitionProps(unprocessedProps);
  let { type, title, children } = props;
  let color = AdmonitionTypeToColorRecord[type];
  let Icon = AdmonitionTypeToIconRecord[type];

  if (!Icon) {
    Icon = AdmonitionTypeToIconRecord.info;
  }

  if (!color) {
    color = "blue";
  }

  if (!title) {
    title = type;
  }

  return (
    <Callout.Root color={color} variant="surface" size="2" className="admonition">
      <Flex direction="row" gap="2" align="center" mb="2">
        <Callout.Icon>
          <Icon />
        </Callout.Icon>
        <span style={{ textTransform: "capitalize" }}>{title}</span>
      </Flex>
      <div className="admonition__content">{children}</div>
    </Callout.Root>
  );
}
