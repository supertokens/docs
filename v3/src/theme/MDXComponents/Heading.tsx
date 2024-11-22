import React from "react";
import Heading from "@theme/Heading";
import type { Props } from "@theme/MDXComponents/Heading";

export default function MDXHeading(props: Props): JSX.Element {
  return <Heading {...props} />;
}
