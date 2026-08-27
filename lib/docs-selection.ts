import type { SelectOption } from "@/components/ui/select-field";
import type { TabGroup } from "@/components/tab-groups";

export const selectionEvent = "supertokens-docs:selection";
export const selectionReadyEvent = "supertokens-docs:selection-ready";
export const variantEvent = "supertokens-docs:variant";

export interface SelectionDetail {
  group: string;
  value: string;
}

export interface VariantDetail {
  key: string;
  value: string;
}

interface ResolveSelectionOptions {
  availableValues: Iterable<string>;
  defaultValue?: string | null;
  legacyValue?: string | null;
  migratedValue?: string | null;
  storedValue?: string | null;
}

interface BlumeTabsElement extends HTMLElement {
  activate(index: number, sync: boolean, updateHash: boolean): void;
}

const displayLabels: Record<string, string> = {
  "aws-lambda": "AWS Lambda",
  http: "HTTP",
  ios: "iOS",
  nextjs: "Next.js",
  nestjs: "NestJS",
  nodejs: "Node.js",
  reactjs: "React",
  reactnative: "React Native",
  webjs: "Web JS",
};

export const selectionStorageKey = (group: string) => `supertokens-docs:selection:${group}`;

export function resolveSelection({
  availableValues,
  defaultValue,
  legacyValue,
  migratedValue,
  storedValue,
}: ResolveSelectionOptions): string | undefined {
  const values = [...availableValues];
  const validValues = new Set(values);
  return [migratedValue, storedValue, legacyValue, defaultValue, values[0]].find((value): value is string =>
    Boolean(value && validValues.has(value)),
  );
}

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Controls still work for the current page when storage is unavailable.
  }
}

export function removeStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Controls still work when storage is unavailable.
  }
}

export function isActiveVariant(element: Element): boolean {
  return !element.closest<HTMLElement>("[data-variant-content]")?.hidden;
}

export function directPanels(wrapper: HTMLElement): HTMLElement[] {
  return [
    ...wrapper.querySelectorAll<HTMLElement>(":scope > blume-tabs > [data-blume-tab-content] > [data-blume-tab-panel]"),
  ];
}

export function optionsForWrapper(wrapper: HTMLElement): SelectOption[] {
  return directPanels(wrapper).flatMap((panel) => {
    const value = panel.dataset.tabId;
    const title = panel.dataset.title;
    return value && title ? [{ value, label: displayLabels[value] || title }] : [];
  });
}

export function optionsForGroup(group: TabGroup, root: ParentNode = document): SelectOption[] {
  let options: Map<string, string> | undefined;
  for (const wrapper of root.querySelectorAll<HTMLElement>(`[data-docs-tab-group="${group}"]`)) {
    if (!isActiveVariant(wrapper)) continue;
    const wrapperOptions = new Map(optionsForWrapper(wrapper).map((option) => [option.value, option.label]));
    if (!options) {
      options = wrapperOptions;
      continue;
    }
    for (const value of options.keys()) {
      if (!wrapperOptions.has(value)) options.delete(value);
    }
  }
  return [...(options || [])].map(([value, label]) => ({ value, label }));
}

export function selectedGroupValue(group: TabGroup, options: SelectOption[], root: ParentNode = document) {
  const values = new Set(options.map((option) => option.value));
  const stored = readStorage(selectionStorageKey(group));
  if (stored && values.has(stored)) return stored;

  for (const wrapper of root.querySelectorAll<HTMLElement>(`[data-docs-tab-group="${group}"]`)) {
    if (!isActiveVariant(wrapper)) continue;
    const selected = directPanels(wrapper).find((panel) => !panel.classList.contains("hidden"))?.dataset.tabId;
    if (selected && values.has(selected)) return selected;
  }

  return options[0]?.value;
}

export function activateSelection(wrapper: HTMLElement, value: string): boolean {
  const tabs = wrapper.querySelector<BlumeTabsElement>(":scope > blume-tabs");
  const index = directPanels(wrapper).findIndex((panel) => panel.dataset.tabId === value);
  if (tabs && index >= 0) tabs.activate(index, false, false);
  return index >= 0;
}

export function dispatchSelection(group: string, value: string): void {
  writeStorage(selectionStorageKey(group), value);
  window.dispatchEvent(new CustomEvent<SelectionDetail>(selectionEvent, { detail: { group, value } }));
}

export function dispatchVariant(key: string, value: string): void {
  writeStorage(`supertokens-docs:${key}`, value);
  window.dispatchEvent(new CustomEvent<VariantDetail>(variantEvent, { detail: { key, value } }));
}
