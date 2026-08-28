export type CodeWrapIcon = "wrap" | "unwrap";

export const codeWrapIcons: Record<CodeWrapIcon, string> = {
  wrap: `
    <svg aria-hidden="true" data-docs-code-wrap-icon="wrap" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18" />
      <path d="M3 12h15a3 3 0 1 1 0 6h-4" />
      <path d="m16 16-2 2 2 2" />
      <path d="M3 18h7" />
    </svg>
  `,
  unwrap: `
    <svg aria-hidden="true" data-docs-code-wrap-icon="unwrap" fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  `,
};

export const codeWrapButtonLabel = "Wrap code lines";

export interface CodeWrapPresentation {
  icon: CodeWrapIcon;
  pressed: string;
  title: string;
  unwrapped: boolean;
}

export const codeWrapPresentation = (wrapped: boolean): CodeWrapPresentation => ({
  icon: wrapped ? "unwrap" : "wrap",
  pressed: String(wrapped),
  title: wrapped ? "Unwrap code lines" : "Wrap code lines",
  unwrapped: !wrapped,
});

const isEligibleCodeBlock = (pre: HTMLPreElement): boolean => {
  if (pre.parentElement?.closest("pre")) return false;
  if (pre.matches(".twoslash, .blume-source")) return false;
  if (pre.closest("blume-panel-tabs, [data-api-request-tabs]")) return false;

  return pre.querySelector(":scope > code") !== null && pre.querySelector(":scope > [data-blume-copy]") !== null;
};

const setWrapped = (pre: HTMLPreElement, button: HTMLButtonElement, wrapped: boolean): void => {
  const presentation = codeWrapPresentation(wrapped);
  pre.toggleAttribute("data-docs-code-unwrapped", presentation.unwrapped);
  button.ariaPressed = presentation.pressed;
  button.title = presentation.title;
  button.innerHTML = codeWrapIcons[presentation.icon];
};

export const initializeCodeWrapToggles = (): void => {
  for (const pre of document.querySelectorAll<HTMLPreElement>(".prose pre")) {
    if (!isEligibleCodeBlock(pre) || pre.querySelector(":scope > [data-docs-code-wrap-toggle]")) continue;

    const copyButton = pre.querySelector<HTMLElement>(":scope > [data-blume-copy]");
    if (!copyButton) continue;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "st-code-wrap-toggle";
    button.dataset.docsCodeWrapToggle = "";
    button.setAttribute("aria-label", codeWrapButtonLabel);
    const code = pre.querySelector<HTMLElement>(":scope > code");
    if (code && !code.hasAttribute("tabindex")) code.tabIndex = 0;
    setWrapped(pre, button, true);
    button.addEventListener("click", () => setWrapped(pre, button, button.ariaPressed !== "true"));
    copyButton.insertAdjacentElement("beforebegin", button);
  }
};
