import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { PresentedOption } from "@/components/option-presentation";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { firstVisibleOwner, isVisibilityChainVisible } from "@/lib/dependent-content-state";
import {
  dispatchSelection,
  readStorage,
  resolveSelection,
  selectionEvent,
  selectionStorageKey,
  type SelectionDetail,
  writeStorage,
} from "@/lib/docs-selection";

interface DependentContentControllerProps {
  defaultValue?: string;
  fallbackHostId: string;
  group: string;
  label: string;
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
  const parentTabs = wrapper.closest<HTMLElement>(".st-tab-group");
  const panel = parentTabs
    ? [
        ...parentTabs.querySelectorAll<HTMLElement>(
          ":scope > blume-tabs > [data-blume-tab-content] > [data-blume-tab-panel]",
        ),
      ].find((candidate) => candidate.contains(wrapper))
    : undefined;
  const hostId = parentTabs?.dataset.docsTabAccessoryHostId;
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
  wrapperId,
}: DependentContentControllerProps) {
  const [host, setHost] = useState<HTMLElement>();
  const [isOwner, setIsOwner] = useState(false);
  const [options, setOptions] = useState<ContentOption[]>([]);
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const wrapper = document.getElementById(wrapperId);
    const fallbackHost = document.getElementById(fallbackHostId);
    if (!wrapper || !fallbackHost) return;

    const nextOptions = contentOptions(wrapper);
    if (nextOptions.length === 0) return;

    const availableValues = nextOptions.map((option) => option.value);
    const nextValue = resolveSelection({
      availableValues,
      defaultValue,
      legacyValue: readStorage(`docusaurus.tab.${group}`),
      storedValue: readStorage(selectionStorageKey(group)),
    });
    if (!nextValue) return;

    setVisibleOption(nextOptions, nextValue);
    wrapper.dataset.selectionReady = "true";
    writeStorage(selectionStorageKey(group), nextValue);
    setOptions(nextOptions);
    setValue(nextValue);

    const context = controllerContext(wrapper, fallbackHost);
    if (!context) return;
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

    const applyValue = (nextSelection: string) => {
      if (!setVisibleOption(nextOptions, nextSelection)) return;
      setValue(nextSelection);
    };
    const synchronize = (event: Event) => {
      const detail = (event as CustomEvent<SelectionDetail>).detail;
      if (detail?.group === group) applyValue(detail.value);
    };
    const synchronizeStorage = (event: StorageEvent) => {
      if (event.key === selectionStorageKey(group) && event.newValue) applyValue(event.newValue);
    };

    window.addEventListener(selectionEvent, synchronize);
    window.addEventListener("storage", synchronizeStorage);
    return () => {
      for (const observer of observers) observer.disconnect();
      delete wrapper.dataset.selectionReady;
      for (const option of nextOptions) option.section.hidden = false;
      window.removeEventListener(ownershipEvent, synchronizeOwnership);
      window.removeEventListener(selectionEvent, synchronize);
      window.removeEventListener("storage", synchronizeStorage);
      queueMicrotask(notifyOwnershipChange);
    };
  }, [defaultValue, fallbackHostId, group, wrapperId]);

  if (options.length < 2 || !host || !isOwner || !value) return null;

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
