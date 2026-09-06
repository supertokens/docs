interface ControlTooltipOptions {
  id: string;
  label?: string;
}

const addDescription = (trigger: HTMLElement, id: string) => {
  const descriptions = new Set((trigger.getAttribute("aria-describedby") ?? "").split(/\s+/u).filter(Boolean));
  descriptions.add(id);
  trigger.setAttribute("aria-describedby", [...descriptions].join(" "));
};

export const initializeControlTooltip = (trigger: HTMLElement, { id, label }: ControlTooltipOptions) => {
  if (trigger.dataset.stTooltipInitialized) return;

  const tooltipLabel = label ?? trigger.getAttribute("aria-label")?.trim();
  if (!tooltipLabel) return;

  const existingTooltip = trigger.querySelector<HTMLElement>(":scope > .st-control-tooltip");
  const tooltip = existingTooltip ?? document.createElement("span");
  tooltip.className = "st-control-tooltip";
  tooltip.id = id;
  tooltip.role = "tooltip";
  tooltip.textContent = tooltipLabel;
  if (!existingTooltip) trigger.append(tooltip);

  trigger.dataset.stTooltipInitialized = "true";
  trigger.classList.add("st-tooltip-trigger");
  addDescription(trigger, id);
  trigger.addEventListener("pointerenter", () => delete trigger.dataset.stTooltipDismissed);
  trigger.addEventListener("blur", () => delete trigger.dataset.stTooltipDismissed);
  trigger.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    trigger.dataset.stTooltipDismissed = "true";
  });
};
