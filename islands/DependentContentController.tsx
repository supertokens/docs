import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { PresentedOption } from "@/components/option-presentation";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { firstVisibleOwner, isVisibilityChainVisible } from "@/lib/dependent-content-state";
import {
  dispatchSelection,
  readStorage,
  resolveSelection,
  selectionContentReadyEvent,
  selectionEvent,
  selectionStorageKey,
  type SelectionDetail,
  writeStorage,
} from "@/lib/docs-selection";

interface DependentContentControllerProps {
  defaultValue?: string;
  fallbackHostId?: string;
  group: string;
  label: string;
  passive?: boolean;
  wrapperId: string;
}

interface ContentOption extends SelectOption {
  section: HTMLElement;
}

interface ControllerContext {
  host: HTMLElement;
  visibilityElements: HTMLElement[];
}

const ownershipEvent = "supertokens-docs:dependent-content-ownership";

function contentOptions(wrapper: HTMLElement): ContentOption[] {
  return [...wrapper.querySelectorAll<HTMLElement>(":scope > [data-docs-content-option]")].flatMap((section) => {
    const label = section.dataset.selectionLabel;
    const value = section.dataset.selectionValue;
    return label && value ? [{ label, section, value }] : [];
  });
}

function setVisibleOption(options: ContentOption[], value: string): boolean {
  if (!options.some((option) => option.value === value)) return false;
  for (const option of options) option.section.hidden = option.value !== value;
  return true;
}

function primaryContext(wrapper: HTMLElement): ControllerContext | undefined {
  const parentTabs = wrapper.closest<HTMLElement>(".st-selection-group");
  const panel = parentTabs
    ? [
        ...parentTabs.querySelectorAll<HTMLElement>(
          ":scope > blume-tabs > [data-blume-tab-content] > [data-blume-tab-panel]",
        ),
      ].find((candidate) => candidate.contains(wrapper))
    : undefined;
  const hostId = parentTabs?.dataset.docsSelectionAccessoryHostId;
  const host = hostId ? document.getElementById(hostId) : null;
  return panel && host ? { host, visibilityElements: visibilityElements(wrapper, panel) } : undefined;
}

function visibilityElements(wrapper: HTMLElement, primaryPanel?: HTMLElement): HTMLElement[] {
  const elements = new Set<HTMLElement>();
  if (primaryPanel) elements.add(primaryPanel);
  for (let ancestor = wrapper.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.matches("[data-variant-content], [data-docs-content-option]")) elements.add(ancestor);
  }
  return [...elements];
}

function controllerContext(wrapper: HTMLElement, fallbackHost?: HTMLElement): ControllerContext | undefined {
  return (
    primaryContext(wrapper) ||
    (fallbackHost ? { host: fallbackHost, visibilityElements: visibilityElements(wrapper) } : undefined)
  );
}

function contextIsVisible(context: ControllerContext): boolean {
  return isVisibilityChainVisible(
    context.visibilityElements.map((element) => ({
      hidden: element.hasAttribute("hidden"),
      hiddenClass: element.classList.contains("hidden"),
    })),
  );
}

function ownerForHost(group: string, host: HTMLElement): HTMLElement | undefined {
  const candidates = [...document.querySelectorAll<HTMLElement>("[data-docs-dependent-content]")]
    .filter(
      (candidate) =>
        candidate.dataset.docsDependentContent === group &&
        candidate.dataset.docsDependentContentPassive !== "true" &&
        candidate.querySelectorAll(":scope > [data-docs-content-option]").length >= 2,
    )
    .flatMap((candidate) => {
      const fallback = candidate.querySelector<HTMLElement>(":scope > [data-standalone-accessory-host]") || undefined;
      const context = controllerContext(candidate, fallback);
      return context?.host === host ? [{ owner: candidate, visible: contextIsVisible(context) }] : [];
    });
  return firstVisibleOwner(candidates);
}

export default function DependentContentController({
  defaultValue,
  fallbackHostId,
  group,
  label,
  passive = false,
  wrapperId,
}: DependentContentControllerProps) {
  const [host, setHost] = useState<HTMLElement>();
  const [isOwner, setIsOwner] = useState(false);
  const [options, setOptions] = useState<ContentOption[]>([]);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const wrapper = document.getElementById(wrapperId);
    const fallbackHost = fallbackHostId ? document.getElementById(fallbackHostId) || undefined : undefined;
    if (!wrapper) return;
    const inheritedPassive =
      wrapper.closest<HTMLElement>(".st-selection-group")?.dataset.docsSelectionPassive === "true";
    const effectivePassive = passive || inheritedPassive;

    const nextOptions = contentOptions(wrapper);
    if (nextOptions.length === 0) return;

    const availableValues = nextOptions.map((option) => option.value);
    const storedValue = readStorage(selectionStorageKey(group));
    const hasUnavailableStoredValue = Boolean(storedValue && !availableValues.includes(storedValue));
    const nextValue = hasUnavailableStoredValue
      ? undefined
      : resolveSelection({
          availableValues,
          defaultValue,
          legacyValue: readStorage(`docusaurus.tab.${group}`),
          storedValue,
        });
    if (!nextValue && !hasUnavailableStoredValue) return;

    for (const option of nextOptions) option.section.hidden = hasUnavailableStoredValue;
    if (nextValue) setVisibleOption(nextOptions, nextValue);
    document.dispatchEvent(new CustomEvent(selectionContentReadyEvent));
    wrapper.dataset.selectionReady = "true";
    wrapper.toggleAttribute("data-docs-selection-unavailable", hasUnavailableStoredValue);
    if (nextValue && !storedValue) writeStorage(selectionStorageKey(group), nextValue);
    setOptions(nextOptions);
    setValue(nextValue);

    const applyValue = (nextSelection: string) => {
      const isAvailable = setVisibleOption(nextOptions, nextSelection);
      wrapper.toggleAttribute("data-docs-selection-unavailable", !isAvailable);
      if (!isAvailable) {
        for (const option of nextOptions) option.section.hidden = true;
      }
      setValue(isAvailable ? nextSelection : undefined);
      document.dispatchEvent(new CustomEvent(selectionContentReadyEvent));
    };
    const synchronize = (event: Event) => {
      const detail = (event as CustomEvent<SelectionDetail>).detail;
      if (detail?.group === group) applyValue(detail.value);
    };
    const synchronizeStorage = (event: StorageEvent) => {
      if (event.key === selectionStorageKey(group) && event.newValue) applyValue(event.newValue);
    };
    const cleanUpSelection = () => {
      delete wrapper.dataset.selectionReady;
      wrapper.removeAttribute("data-docs-selection-unavailable");
      for (const option of nextOptions) option.section.hidden = false;
      window.removeEventListener(selectionEvent, synchronize);
      window.removeEventListener("storage", synchronizeStorage);
    };

    window.addEventListener(selectionEvent, synchronize);
    window.addEventListener("storage", synchronizeStorage);
    if (effectivePassive) return cleanUpSelection;

    const context = controllerContext(wrapper, fallbackHost);
    if (!context) return cleanUpSelection;
    setHost(context.host);

    const updateOwnership = () =>
      setIsOwner(contextIsVisible(context) && ownerForHost(group, context.host) === wrapper);
    const notifyOwnershipChange = () => {
      window.dispatchEvent(new CustomEvent(ownershipEvent, { detail: { group } }));
    };
    const observers = context.visibilityElements.map((element) => {
      const observer = new MutationObserver(() => {
        updateOwnership();
        notifyOwnershipChange();
      });
      observer.observe(element, { attributes: true, attributeFilter: ["class", "hidden"] });
      return observer;
    });
    const synchronizeOwnership = (event: Event) => {
      const detail = (event as CustomEvent<{ group?: string }>).detail;
      if (detail?.group === group) updateOwnership();
    };
    window.addEventListener(ownershipEvent, synchronizeOwnership);
    updateOwnership();

    return () => {
      for (const observer of observers) observer.disconnect();
      cleanUpSelection();
      window.removeEventListener(ownershipEvent, synchronizeOwnership);
      queueMicrotask(notifyOwnershipChange);
    };
  }, [defaultValue, fallbackHostId, group, passive, wrapperId]);

  if (passive || options.length < 2 || !host || !isOwner || !value) return null;

  return createPortal(
    <div className="st-secondary-choice" data-secondary-choice={group}>
      <SelectField
        label={label}
        options={options.map(({ label: optionLabel, value: optionValue }) => ({
          label: optionLabel,
          value: optionValue,
        }))}
        renderOption={(option) => <PresentedOption label={option.label} value={option.value} />}
        value={value}
        onValueChange={(nextValue) => {
          setVisibleOption(options, nextValue);
          setValue(nextValue);
          dispatchSelection(group, nextValue);
        }}
      />
    </div>,
    host,
  );
}
