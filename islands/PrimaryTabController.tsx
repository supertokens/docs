import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { PresentedOption } from "@/components/option-presentation";
import type { TabGroup } from "@/components/tab-groups";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import {
  activateSelection,
  directPanels,
  dispatchSelection,
  initializeSelectionUrlState,
  isSelectionContextVisible,
  optionsForWrapper,
  selectedGroupValue,
  selectionEvent,
  selectionReadyEvent,
  selectionStorageKey,
  selectionUrlStateEvent,
  type SelectionDetail,
  writeStorage,
  readQuery,
} from "@/lib/docs-selection";

interface PrimaryTabControllerProps {
  defaultValue?: string;
  group?: TabGroup;
  label: string;
  passive?: boolean;
  showOptionMarks?: boolean;
  wrapperId: string;
}

interface ControllerState {
  host: HTMLElement;
  options: SelectOption[];
  value: string;
  wrapper: HTMLElement;
}

export default function PrimaryTabController({
  defaultValue,
  group,
  label,
  passive = false,
  showOptionMarks = true,
  wrapperId,
}: PrimaryTabControllerProps) {
  const [state, setState] = useState<ControllerState>();

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};
    let readyListener: ((event: Event) => void) | undefined;

    void customElements.whenDefined("blume-tabs").then(async () => {
      if (cancelled) return;
      const wrapper = document.getElementById(wrapperId);
      const host = wrapper?.querySelector<HTMLElement>(":scope > blume-tabs > div > [data-blume-tablist]");
      if (!wrapper || !host) return;

      if (group && wrapper.dataset.groupSelectionReady !== "true") {
        await new Promise<void>((resolve) => {
          readyListener = (event) => {
            const detail = (event as CustomEvent<{ wrapperId?: string }>).detail;
            if (detail?.wrapperId !== wrapperId) return;
            document.removeEventListener(selectionReadyEvent, readyListener!);
            readyListener = undefined;
            resolve();
          };
          document.addEventListener(selectionReadyEvent, readyListener);
        });
      }
      if (cancelled) return;

      const options = optionsForWrapper(wrapper);
      const activeValue = directPanels(wrapper).find((panel) => !panel.classList.contains("hidden"))?.dataset.tabId;
      const value = group
        ? selectedGroupValue(group, options, wrapper, isSelectionContextVisible(wrapper))
        : options.find((option) => option.value === activeValue)?.value || options[0]?.value;
      if (options.length < 2 || !value) return;

      const previousRole = host.getAttribute("role");
      const previousAriaLabel = host.getAttribute("aria-label");
      const previousAriaLabelledBy = host.getAttribute("aria-labelledby");
      const panels = directPanels(wrapper).map((panel) => ({
        element: panel,
        ariaLabel: panel.getAttribute("aria-label"),
        ariaLabelledBy: panel.getAttribute("aria-labelledby"),
        role: panel.getAttribute("role"),
      }));
      host.removeAttribute("role");
      host.removeAttribute("aria-label");
      host.removeAttribute("aria-labelledby");
      for (const { element } of panels) {
        element.setAttribute("role", "region");
        element.removeAttribute("aria-labelledby");
        if (element.dataset.title) element.setAttribute("aria-label", element.dataset.title);
      }
      wrapper.dataset.primarySelectionReady = "true";
      setState({ host, options, value, wrapper });

      const applyValue = (nextValue: string | undefined) => {
        if (!nextValue || !options.some((option) => option.value === nextValue)) {
          setState(undefined);
          return;
        }
        setState({ host, options, value: nextValue, wrapper });
      };
      const synchronize = (event: Event) => {
        if (!group) return;
        const detail = (event as CustomEvent<SelectionDetail>).detail;
        if (detail?.group === group) applyValue(detail.value);
      };
      const synchronizeStorage = (event: StorageEvent) => {
        if (!group) return;
        if (event.key !== selectionStorageKey(group) || !event.newValue) return;
        applyValue(selectedGroupValue(group, options, wrapper, isSelectionContextVisible(wrapper)));
      };
      const synchronizeUrl = () => {
        if (!group) return;
        const nextValue = selectedGroupValue(group, options, wrapper, isSelectionContextVisible(wrapper));
        applyValue(nextValue);
        if (nextValue && readQuery(group) === nextValue) writeStorage(selectionStorageKey(group), nextValue);
      };
      if (group) {
        window.addEventListener(selectionEvent, synchronize);
        window.addEventListener("storage", synchronizeStorage);
        window.addEventListener(selectionUrlStateEvent, synchronizeUrl);
        initializeSelectionUrlState();
      }
      cleanup = () => {
        delete wrapper.dataset.primarySelectionReady;
        if (previousRole) host.setAttribute("role", previousRole);
        if (previousAriaLabel) host.setAttribute("aria-label", previousAriaLabel);
        if (previousAriaLabelledBy) host.setAttribute("aria-labelledby", previousAriaLabelledBy);
        for (const { element, ariaLabel, ariaLabelledBy, role } of panels) {
          if (role) element.setAttribute("role", role);
          else element.removeAttribute("role");
          if (ariaLabel) element.setAttribute("aria-label", ariaLabel);
          else element.removeAttribute("aria-label");
          if (ariaLabelledBy) element.setAttribute("aria-labelledby", ariaLabelledBy);
          else element.removeAttribute("aria-labelledby");
        }
        window.removeEventListener(selectionEvent, synchronize);
        window.removeEventListener("storage", synchronizeStorage);
        window.removeEventListener(selectionUrlStateEvent, synchronizeUrl);
      };
    });

    return () => {
      cancelled = true;
      if (readyListener) document.removeEventListener(selectionReadyEvent, readyListener);
      cleanup();
    };
  }, [defaultValue, group, wrapperId]);

  if (passive || !state) return null;

  return createPortal(
    <div className="st-primary-choice" data-primary-choice={group || "local"}>
      <SelectField
        label={label}
        options={state.options}
        renderOption={
          showOptionMarks
            ? (option) => <PresentedOption label={option.label} value={option.value} />
            : (option) => option.label
        }
        value={state.value}
        onValueChange={(value) => {
          if (group) {
            dispatchSelection(group, value);
          } else if (activateSelection(state.wrapper, value)) {
            setState((current) => (current ? { ...current, value } : current));
          }
        }}
      />
    </div>,
    state.host,
  );
}
