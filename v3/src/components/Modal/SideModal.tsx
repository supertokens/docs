import * as React from "react";

import { Dialog } from "@radix-ui/themes";

import "./SideModal.scss";

const SideModalContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <Dialog.Content ref={ref} className={`side-modal-content side-modal-content--right ${className || ""}`} {...props}>
    {children}
  </Dialog.Content>
));
SideModalContent.displayName = Dialog.Content.displayName;

export const SideModal = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Title: Dialog.Title,
  Description: Dialog.Description,
  Content: SideModalContent,
};
