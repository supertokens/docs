import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import { DocItemContextValue } from "../components/DocItemContext";

export default {
  // Re-use the default mapping
  ...MDXComponents,
  DocItemContextValue,
};
