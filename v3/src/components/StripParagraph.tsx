import React, { isValidElement, Children } from "react";

interface ParagraphStripperProps {
  children: React.ReactNode;
}

export const ParagraphStripper: React.FC<ParagraphStripperProps> = ({ children }) => {
  const child = Children.only(children);
  console.log("stripper");

  console.log(children);

  if (isValidElement(child) && child.type === "p") {
    return child.props.children;
  }

  return child;
};
