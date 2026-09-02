import type { SelectOption } from "@/components/ui/select-field";
import { tabGroups, type TabGroup } from "../components/tab-groups";

export const selectionEvent = "supertokens-docs:selection";
export const selectionContentReadyEvent = "supertokens-docs:selection-content-ready";
export const selectionReadyEvent = "supertokens-docs:selection-ready";
export const selectionUrlStateEvent = "supertokens-docs:selection-url-state";
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
  queryAvailableValues?: Iterable<string>;
  queryValue?: string | null;
  storedValue?: string | null;
}

export interface SelectionResolution {
  shouldPersist: boolean;
  unavailableStoredValue: boolean;
  value?: string;
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
export const variantStorageKey = (key: string) => `supertokens-docs:${key}`;

let selectionUrlStateInitialized = false;

const queryKeyAliases: Record<string, string> = {
  "backend-language": "backend",
  "frontend-custom-ui": "frontend",
  "frontend-platforms": "frontend",
  "frontend-prebuilt-ui": "frontend",
  "mobile-frameworks": "frontend-framework",
  "package-managers": "package-manager",
  "ui-type": "ui",
};

export function selectionQueryKey(key: string): string {
  if (key.endsWith("-frameworks") && key !== "mobile-frameworks") return "backend-framework";
  return queryKeyAliases[key] ?? key;
}

export function valuesForSelectionGroup(group: TabGroup): string[] {
  return [...new Set(Object.values(tabGroups[group].options as Record<string, string>))];
}

export function valuesForSelectionQuery(group: TabGroup): string[] {
  const queryKey = selectionQueryKey(group);
  return [
    ...new Set(
      (Object.keys(tabGroups) as TabGroup[])
        .filter((candidate) => selectionQueryKey(candidate) === queryKey)
        .flatMap(valuesForSelectionGroup),
    ),
  ];
}

export function selectionUrl(href: string, key: string, value: string): string {
  const url = new URL(href);
  url.searchParams.set(selectionQueryKey(key), value);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function canonicalSelectionUrl(href: string, key: string, value: string): string {
  const url = new URL(href);
  const queryKey = selectionQueryKey(key);
  if (!url.searchParams.has(queryKey)) url.searchParams.set(queryKey, value);
  return `${url.pathname}${url.search}${url.hash}`;
}

export function readQuery(key: string): string | null {
  return new URL(window.location.href).searchParams.get(selectionQueryKey(key));
}

export function replaceQuery(key: string, value: string): void {
  window.history.replaceState(window.history.state, "", selectionUrl(window.location.href, key, value));
}

export function ensureQuery(key: string, value: string): void {
  if (readQuery(key) !== null) return;
  window.history.replaceState(window.history.state, "", canonicalSelectionUrl(window.location.href, key, value));
}

export function removeQuery(key: string): void {
  const url = new URL(window.location.href);
  const queryKey = selectionQueryKey(key);
  if (!url.searchParams.has(queryKey)) return;
  url.searchParams.delete(queryKey);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
}

export function readCanonicalQuery(key: string, availableValues: Iterable<string>): string | null {
  const value = readQuery(key);
  if (!value) return null;
  if (new Set(availableValues).has(value)) return value;
  removeQuery(key);
  return null;
}

export function readContextualQuery(
  key: string,
  contextValues: Iterable<string>,
  queryValues: Iterable<string>,
  contextIsVisible: boolean,
  fallbackValue?: string,
): string | null {
  const queryValue = readCanonicalQuery(key, queryValues);
  if (!queryValue || new Set(contextValues).has(queryValue) || !contextIsVisible) return queryValue;
  if (!fallbackValue) return null;
  replaceQuery(key, fallbackValue);
  return fallbackValue;
}

export function initializeSelectionUrlState(): void {
  if (selectionUrlStateInitialized) return;
  selectionUrlStateInitialized = true;
  window.addEventListener("popstate", () => window.dispatchEvent(new CustomEvent(selectionUrlStateEvent)));
}

export function readGlobalValue(
  key: string,
  availableValues: Iterable<string>,
  storageKey: string,
  queryAvailableValues: Iterable<string> = availableValues,
): string | null {
  const values = new Set(availableValues);
  const queryValue = readCanonicalQuery(key, queryAvailableValues);
  if (queryValue) return queryValue;
  const storedValue = readStorage(storageKey);
  return storedValue && values.has(storedValue) ? storedValue : null;
}

export function resolveSelection({
  availableValues,
  defaultValue,
  legacyValue,
  migratedValue,
  queryAvailableValues,
  queryValue,
  storedValue,
}: ResolveSelectionOptions): string | undefined {
  const values = [...availableValues];
  const validValues = new Set(values);
  const validQueryValues = new Set(queryAvailableValues ?? values);
  if (queryValue && validQueryValues.has(queryValue)) return queryValue;
  return [migratedValue, storedValue, legacyValue, defaultValue, values[0]].find((value): value is string =>
    Boolean(value && validValues.has(value)),
  );
}

export function resolveSelectionState(options: ResolveSelectionOptions): SelectionResolution {
  const values = new Set(options.availableValues);
  const queryValues = new Set(options.queryAvailableValues ?? values);
  const queryIsValid = Boolean(options.queryValue && queryValues.has(options.queryValue));
  const migratedIsValid = Boolean(options.migratedValue && values.has(options.migratedValue));
  const storedIsValid = Boolean(options.storedValue && values.has(options.storedValue));
  const value = resolveSelection(options);

  return {
    shouldPersist: Boolean(value && (queryIsValid || migratedIsValid || !options.storedValue)),
    unavailableStoredValue: Boolean(options.storedValue && !storedIsValid && !migratedIsValid && !queryIsValid),
    value,
  };
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

export function isSelectionContextVisible(element: HTMLElement): boolean {
  for (let current: HTMLElement | null = element; current; current = current.parentElement) {
    const variantKey = current.dataset.variantContent;
    const variantValue = current.dataset.variantValue;
    const queryValue = variantKey ? readQuery(variantKey) : null;
    const queriedVariant =
      variantKey && queryValue
        ? document.querySelector(
            `[data-variant-content="${CSS.escape(variantKey)}"][data-variant-value="${CSS.escape(queryValue)}"]`,
          )
        : null;
    const querySelectsVariant = Boolean(queriedVariant && queryValue === variantValue);
    if (!querySelectsVariant && (current.hidden || current.classList.contains("hidden"))) return false;
    if (queriedVariant && !querySelectsVariant) return false;
    if (current.hasAttribute("data-docs-content-option")) {
      const owner = current.parentElement?.closest<HTMLElement>("[data-docs-dependent-content]");
      if (owner?.dataset.selectionReady !== "true") return false;
    }
  }
  return true;
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
  const options = new Map<string, string>();
  for (const wrapper of root.querySelectorAll<HTMLElement>(`[data-docs-selection-group="${group}"]`)) {
    if (!isActiveVariant(wrapper)) continue;
    for (const option of optionsForWrapper(wrapper)) {
      if (!options.has(option.value)) options.set(option.value, option.label);
    }
  }
  return [...options].map(([value, label]) => ({ value, label }));
}

export function selectedGroupValue(
  group: TabGroup,
  options: SelectOption[],
  root: ParentNode = document,
  contextIsVisible = true,
) {
  const values = new Set(options.map((option) => option.value));
  const groupValues = valuesForSelectionGroup(group);
  const storedValue = readStorage(selectionStorageKey(group));
  const fallbackValue = resolveSelection({
    availableValues: groupValues,
    defaultValue: tabGroups[group].defaultValue,
    storedValue,
  });
  const queryValue = readContextualQuery(
    group,
    groupValues,
    valuesForSelectionQuery(group),
    contextIsVisible,
    fallbackValue,
  );
  if (queryValue && values.has(queryValue)) return queryValue;
  if (queryValue) return undefined;
  if (storedValue && values.has(storedValue)) return storedValue;

  for (const wrapper of root.querySelectorAll<HTMLElement>(`[data-docs-selection-group="${group}"]`)) {
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
  if (["frontend-custom-ui", "frontend-platforms"].includes(group)) removeQuery("mobile-frameworks");
  if (group === "backend-language") removeQuery("node-frameworks");
  writeStorage(selectionStorageKey(group), value);
  replaceQuery(group, value);
  window.dispatchEvent(new CustomEvent<SelectionDetail>(selectionEvent, { detail: { group, value } }));
  window.dispatchEvent(new CustomEvent(selectionUrlStateEvent));
}

export function dispatchVariant(key: string, value: string): void {
  if (key === "ui-type") {
    removeQuery("frontend-prebuilt-ui");
    removeQuery("mobile-frameworks");
  }
  writeStorage(variantStorageKey(key), value);
  replaceQuery(key, value);
  window.dispatchEvent(new CustomEvent<VariantDetail>(variantEvent, { detail: { key, value } }));
}
