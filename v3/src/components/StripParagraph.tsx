import React, { isValidElement } from "react";

interface ParagraphStripperProps {
  children: React.ReactNode;
}

export const ParagraphStripper: React.FC<ParagraphStripperProps> = ({ children }) => {
  if (isValidElement(children) && children.type === "p") {
    return children.props.children;
  }

  return children;
};
