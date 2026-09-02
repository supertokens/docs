import type { SelectOption } from "@/components/ui/select-field";
import { languageFrameworkGroup, tabGroupNames, tabGroups, type TabGroup } from "../components/tab-groups";

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

type TabSelectionValue<Group extends TabGroup> =
  (typeof tabGroups)[Group]["options"][keyof (typeof tabGroups)[Group]["options"]];

const variantDefinitions = {
  "nextjs-router-type": { defaultValue: "app-router", values: ["app-router", "pages-router"] },
  "passwordless-contact-method": {
    defaultValue: "EMAIL",
    values: ["EMAIL", "PHONE", "EMAIL_OR_PHONE"],
  },
  "passwordless-flow-type": {
    defaultValue: "MAGIC_LINK",
    values: ["MAGIC_LINK", "USER_INPUT_CODE", "USER_INPUT_CODE_AND_MAGIC_LINK"],
  },
  "tenant-type": { defaultValue: "single", values: ["single", "multi"] },
  "ui-type": { defaultValue: "prebuilt", values: ["prebuilt", "custom"] },
} as const;

export type VariantSelectionKey = keyof typeof variantDefinitions;

export type DocsSelectionState = {
  [Group in TabGroup]: TabSelectionValue<Group>;
} & {
  [Key in VariantSelectionKey]: (typeof variantDefinitions)[Key]["values"][number];
};

export type DocsSelectionKey = keyof DocsSelectionState;

export type DocsSelectionUpdate = {
  [Key in DocsSelectionKey]: Readonly<{ key: Key; value: DocsSelectionState[Key] }>;
}[DocsSelectionKey];

export interface SelectionStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface DocsSelectionBrowser {
  dispatch(event: Event): void;
  href(): string;
  replace(url: string): void;
}

function isTabGroup(key: string): key is TabGroup {
  return tabGroupNames.includes(key as TabGroup);
}

function valuesForKey<Key extends DocsSelectionKey>(key: Key): readonly string[] {
  return isTabGroup(key)
    ? valuesForSelectionGroup(key)
    : (variantDefinitions[key as VariantSelectionKey].values as readonly string[]);
}

function assignSelection<Key extends DocsSelectionKey>(
  state: DocsSelectionState,
  key: Key,
  value: DocsSelectionState[Key],
): void {
  state[key] = value;
}

function defaultState(): DocsSelectionState {
  const state = {} as DocsSelectionState;
  for (const group of tabGroupNames) {
    assignSelection(state, group, tabGroups[group].defaultValue as DocsSelectionState[typeof group]);
  }
  for (const key of Object.keys(variantDefinitions) as VariantSelectionKey[]) {
    assignSelection(state, key, variantDefinitions[key].defaultValue as DocsSelectionState[typeof key]);
  }
  return state;
}

const serverSelectionSnapshot = Object.freeze(defaultState());

/**
 * SSR-safe selection state. Hydration resolves URL, storage, then defaults; transactions publish once after persistence.
 * Cross-tab synchronization updates URL and memory without writing the received storage value back.
 */
export class DocsSelectionStore {
  private browser?: DocsSelectionBrowser;
  private listeners = new Map<DocsSelectionKey, Set<() => void>>();
  private snapshot: Readonly<DocsSelectionState> = serverSelectionSnapshot;
  private storage?: SelectionStorage;

  init(storage: SelectionStorage | undefined, browser?: DocsSelectionBrowser): void {
    this.storage = storage;
    this.browser = browser;
  }

  hydrate(queryParams: URLSearchParams): void {
    const next = defaultState();
    for (const key of [...tabGroupNames, ...Object.keys(variantDefinitions)] as DocsSelectionKey[]) {
      const values = valuesForKey(key);
      const queryValue = queryParams.get(selectionQueryKey(key));
      const storedValue = this.readStorage(storageKeyForSelection(key));
      const value = [queryValue, storedValue, next[key]].find(
        (candidate): candidate is DocsSelectionState[typeof key] => Boolean(candidate && values.includes(candidate)),
      );
      if (value) assignSelection(next, key, value);
    }
    this.commitSnapshot(next);
  }

  get<Key extends DocsSelectionKey>(key: Key): DocsSelectionState[Key] {
    return this.snapshot[key];
  }

  getSnapshot(): Readonly<DocsSelectionState> {
    return this.snapshot;
  }

  getServerSnapshot(): Readonly<DocsSelectionState> {
    return serverSelectionSnapshot;
  }

  subscribe<Key extends DocsSelectionKey>(key: Key, listener: () => void): () => void {
    const listeners = this.listeners.get(key) ?? new Set();
    listeners.add(listener);
    this.listeners.set(key, listeners);
    return () => {
      listeners.delete(listener);
      if (listeners.size === 0) this.listeners.delete(key);
    };
  }

  set<Key extends DocsSelectionKey>(key: Key, value: DocsSelectionState[Key]): void {
    this.transaction([{ key, value } as DocsSelectionUpdate]);
  }

  transaction(updates: readonly DocsSelectionUpdate[]): void {
    this.commit(updates);
  }

  synchronizeStorage(storageKey: string | null, value: string | null): void {
    if (!storageKey) return;
    const selectionPrefix = "supertokens-docs:selection:";
    const candidate = storageKey.startsWith(selectionPrefix)
      ? storageKey.slice(selectionPrefix.length)
      : storageKey.startsWith("supertokens-docs:")
        ? storageKey.slice("supertokens-docs:".length)
        : undefined;
    if (!candidate) return;
    const keys = [...tabGroupNames, ...Object.keys(variantDefinitions)] as DocsSelectionKey[];
    const key = keys.find((item) => item === candidate);
    if (!key) return;
    const nextValue = (
      value && valuesForKey(key).includes(value) ? value : defaultState()[key]
    ) as DocsSelectionState[typeof key];
    if (key === "backend-language") {
      const language = nextValue as DocsSelectionState["backend-language"];
      const frameworkGroup = languageFrameworkGroup(language);
      const updates: DocsSelectionUpdate[] = [{ key, value: language }];
      if (frameworkGroup) {
        updates.push({ key: frameworkGroup, value: this.get(frameworkGroup) } as DocsSelectionUpdate);
      }
      this.commit(updates, ["backend-framework"], false);
      return;
    }
    if (key === "ui-type") {
      this.commit([{ key, value: nextValue } as DocsSelectionUpdate], ["frontend", "frontend-framework"], false);
      return;
    }
    const frameworkGroup = languageFrameworkGroup(this.get("backend-language"));
    if (isTabGroup(key) && key.endsWith("-frameworks") && key !== frameworkGroup) {
      const next = { ...this.snapshot } as DocsSelectionState;
      Object.assign(next, { [key]: nextValue });
      this.commitSnapshot(next);
      return;
    }
    const removedQueryKeys = ["frontend-custom-ui", "frontend-platforms"].includes(key) ? ["frontend-framework"] : [];
    this.commit([{ key, value: nextValue } as DocsSelectionUpdate], removedQueryKeys, false);
  }

  updateBackendLanguage(value: DocsSelectionState["backend-language"]): void {
    const frameworkGroup = languageFrameworkGroup(value);
    const updates: DocsSelectionUpdate[] = [{ key: "backend-language", value }];
    if (frameworkGroup) updates.push({ key: frameworkGroup, value: this.get(frameworkGroup) } as DocsSelectionUpdate);
    this.commit(updates, ["backend-framework"]);
  }

  updateBackendFramework(
    value:
      | DocsSelectionState["node-frameworks"]
      | DocsSelectionState["go-frameworks"]
      | DocsSelectionState["python-frameworks"],
  ): void {
    const group = languageFrameworkGroup(this.get("backend-language"));
    if (!group || !valuesForSelectionGroup(group).includes(value)) {
      throw new Error(`Backend framework "${value}" is not valid for ${this.get("backend-language")}.`);
    }
    this.set(group, value as DocsSelectionState[typeof group]);
  }

  updateUiType(value: DocsSelectionState["ui-type"]): void {
    this.commit([{ key: "ui-type", value }], ["frontend", "frontend-framework"]);
  }

  private commit(
    updates: readonly DocsSelectionUpdate[],
    removedQueryKeys: readonly string[] = [],
    persist = true,
  ): void {
    if (updates.length === 0) return;
    const keys = new Set<DocsSelectionKey>();
    const queryKeys = new Set<string>();
    for (const update of updates) {
      if (keys.has(update.key)) throw new Error(`Selection transaction contains duplicate key "${update.key}".`);
      keys.add(update.key);
      const queryKey = selectionQueryKey(update.key);
      if (queryKeys.has(queryKey)) {
        throw new Error(`Selection transaction contains multiple values for query parameter "${queryKey}".`);
      }
      queryKeys.add(queryKey);
      if (!valuesForKey(update.key).includes(update.value)) {
        throw new Error(`Invalid value "${update.value}" for selection "${update.key}".`);
      }
    }

    const changed = updates.filter((update) => this.snapshot[update.key] !== update.value);
    const next = { ...this.snapshot } as DocsSelectionState;
    for (const update of changed) assignSelection(next, update.key, update.value);

    const nextUrl = this.updatedUrl(updates, removedQueryKeys);
    if (persist) {
      for (const update of updates) this.writeStorage(storageKeyForSelection(update.key), update.value);
    }
    if (nextUrl) this.replaceUrl(nextUrl);
    if (changed.length === 0) return;
    this.snapshot = Object.freeze(next);
    for (const update of changed) this.notify(update.key);
    for (const update of changed) {
      try {
        this.dispatchCompatibilityEvent(update);
      } catch (error) {
        this.report(error);
      }
    }
  }

  private commitSnapshot(next: DocsSelectionState): void {
    const changed = (Object.keys(next) as DocsSelectionKey[]).filter((key) => this.snapshot[key] !== next[key]);
    if (changed.length === 0) return;
    this.snapshot = Object.freeze(next);
    for (const key of changed) this.notify(key);
  }

  private dispatchCompatibilityEvent(update: DocsSelectionUpdate): void {
    if (!this.browser) return;
    if (isTabGroup(update.key)) {
      this.browser.dispatch(
        new CustomEvent<SelectionDetail>(selectionEvent, { detail: { group: update.key, value: update.value } }),
      );
      return;
    }
    this.browser.dispatch(
      new CustomEvent<VariantDetail>(variantEvent, { detail: { key: update.key, value: update.value } }),
    );
  }

  private readStorage(key: string): string | null {
    try {
      return this.storage?.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private writeStorage(key: string, value: string): void {
    try {
      this.storage?.setItem(key, value);
    } catch {
      // The in-memory store remains usable when persistence is unavailable.
    }
  }

  private notify(key: DocsSelectionKey): void {
    for (const listener of [...(this.listeners.get(key) ?? [])]) {
      try {
        listener();
      } catch (error) {
        this.report(error);
      }
    }
  }

  private report(error: unknown): void {
    const reportError = (globalThis as { reportError?: (reportedError: unknown) => void }).reportError;
    if (reportError) reportError(error);
    else console.error(error);
  }

  private updatedUrl(updates: readonly DocsSelectionUpdate[], removedQueryKeys: readonly string[]): string | undefined {
    if (!this.browser) return;
    try {
      const url = new URL(this.browser.href());
      for (const key of removedQueryKeys) url.searchParams.delete(key);
      for (const update of updates) url.searchParams.set(selectionQueryKey(update.key), update.value);
      return `${url.pathname}${url.search}${url.hash}`;
    } catch (error) {
      this.report(error);
      return;
    }
  }

  private replaceUrl(url: string): void {
    try {
      this.browser?.replace(url);
    } catch (error) {
      this.report(error);
    }
  }
}

export const docsSelection = new DocsSelectionStore();

export function hydrateDocsSelection(): void {
  if (typeof window === "undefined") return;
  docsSelection.hydrate(new URL(window.location.href).searchParams);
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

function storageKeyForSelection(key: DocsSelectionKey): string {
  return isTabGroup(key) ? selectionStorageKey(key) : variantStorageKey(key);
}

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
  if (typeof window === "undefined") return;
  if (selectionUrlStateInitialized) return;
  selectionUrlStateInitialized = true;
  let storage: Storage | undefined;
  try {
    storage = window.localStorage;
  } catch {
    // The external store still works in memory when browser storage is blocked.
  }
  docsSelection.init(storage, {
    dispatch: (event) => window.dispatchEvent(event),
    href: () => window.location.href,
    replace: (url) => window.history.replaceState(window.history.state, "", url),
  });
  const hydrate = () => hydrateDocsSelection();
  const hydrateUrl = () => {
    hydrate();
    window.dispatchEvent(new CustomEvent(selectionUrlStateEvent));
  };
  hydrate();
  window.addEventListener("popstate", hydrateUrl);
  window.addEventListener("storage", (event) => {
    docsSelection.synchronizeStorage(event.key, event.newValue);
    window.dispatchEvent(new CustomEvent(selectionUrlStateEvent));
  });
  document.addEventListener("astro:page-load", hydrate);
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
  if (queryValue) {
    if (
      typeof HTMLElement !== "undefined" &&
      root instanceof HTMLElement &&
      root.hasAttribute("data-docs-selection-unavailable")
    ) {
      const localValue = directPanels(root).find((panel) => !panel.classList.contains("hidden"))?.dataset.tabId;
      if (localValue && values.has(localValue)) return localValue;
    }
    return undefined;
  }
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
  initializeSelectionUrlState();
  if (!isTabGroup(group)) {
    writeStorage(selectionStorageKey(group), value);
    replaceQuery(group, value);
    window.dispatchEvent(new CustomEvent<SelectionDetail>(selectionEvent, { detail: { group, value } }));
    window.dispatchEvent(new CustomEvent(selectionUrlStateEvent));
    return;
  }
  if (group === "backend-language") {
    docsSelection.updateBackendLanguage(value as DocsSelectionState["backend-language"]);
  } else if (group === languageFrameworkGroup(docsSelection.get("backend-language"))) {
    docsSelection.updateBackendFramework(
      value as
        | DocsSelectionState["node-frameworks"]
        | DocsSelectionState["go-frameworks"]
        | DocsSelectionState["python-frameworks"],
    );
  } else {
    if (["frontend-custom-ui", "frontend-platforms"].includes(group)) removeQuery("mobile-frameworks");
    docsSelection.set(group, value as DocsSelectionState[typeof group]);
  }
  window.dispatchEvent(new CustomEvent(selectionUrlStateEvent));
}

export function dispatchVariant(key: string, value: string): void {
  initializeSelectionUrlState();
  if (!Object.hasOwn(variantDefinitions, key)) {
    writeStorage(variantStorageKey(key), value);
    replaceQuery(key, value);
    window.dispatchEvent(new CustomEvent<VariantDetail>(variantEvent, { detail: { key, value } }));
    return;
  }
  const variantKey = key as VariantSelectionKey;
  if (variantKey === "ui-type") docsSelection.updateUiType(value as DocsSelectionState["ui-type"]);
  else docsSelection.set(variantKey, value as DocsSelectionState[typeof variantKey]);
  window.dispatchEvent(new CustomEvent(selectionUrlStateEvent));
}
