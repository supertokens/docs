import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { SelectField, type SelectOption } from "@/components/ui/select-field";
import type { TabGroup } from "@/components/tab-groups";
import {
  directPanels,
  dispatchSelection,
  optionsForWrapper,
  readStorage,
  selectionEvent,
  selectionStorageKey,
  type SelectionDetail,
} from "@/lib/docs-selection";

interface TabGroupSelectProps {
  group: TabGroup;
  label: string;
  wrapperId: string;
}

function initialValue(wrapper: HTMLElement, group: TabGroup, options: SelectOption[]) {
  const stored = readStorage(selectionStorageKey(group));
  if (stored && options.some((option) => option.value === stored)) return stored;
  return directPanels(wrapper).find((panel) => !panel.classList.contains("hidden"))?.dataset.tabId;
}

export default function TabGroupSelect({ group, label, wrapperId }: TabGroupSelectProps) {
  const [options, setOptions] = useState<SelectOption[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement>();
  const [value, setValue] = useState<string>();

  useEffect(() => {
    const availableValues = new Set<string>();
    let cleanupSemantics: (() => void) | undefined;
    let disposed = false;

    const initialize = async () => {
      await customElements.whenDefined("blume-tabs");
      if (disposed) return;

      const wrapper = document.getElementById(wrapperId);
      if (!wrapper) return;
      const nextOptions = optionsForWrapper(wrapper);
      if (nextOptions.length < 2) return;
      for (const option of nextOptions) availableValues.add(option.value);

      const tablist = wrapper.querySelector<HTMLElement>(":scope > blume-tabs [data-blume-tablist]");
      const panels = directPanels(wrapper);
      const roles = panels.map((panel) => panel.getAttribute("role"));
      const labelledBy = panels.map((panel) => panel.getAttribute("aria-labelledby"));
      if (tablist) {
        tablist.hidden = true;
        tablist.setAttribute("aria-hidden", "true");
      }
      for (const panel of panels) {
        panel.removeAttribute("role");
        panel.removeAttribute("aria-labelledby");
      }
      wrapper.dataset.selectReady = "true";
      cleanupSemantics = () => {
        delete wrapper.dataset.selectReady;
        if (tablist) {
          tablist.hidden = false;
          tablist.removeAttribute("aria-hidden");
        }
        panels.forEach((panel, index) => {
          const role = roles[index];
          if (role) panel.setAttribute("role", role);
          const labelId = labelledBy[index];
          if (labelId) panel.setAttribute("aria-labelledby", labelId);
        });
      };

      const parent = wrapper.parentElement;
      const parentPanel = parent?.matches("[data-blume-tab-panel]")
        ? parent
        : parent?.closest<HTMLElement>("[data-blume-tab-panel]");
      const parentTabs = parentPanel?.closest<HTMLElement>("[data-docs-tab-group]");
      const parentHeader = parentTabs?.querySelector<HTMLElement>(":scope > blume-tabs > div");
      const parentTablist = parentHeader?.querySelector<HTMLElement>("[data-blume-tablist]");

      if (parentPanel && parentHeader && parentTablist) {
        setPortalTarget(parentHeader);
        const updateVisibility = () => setIsActive(!parentPanel.classList.contains("hidden"));
        const observer = new MutationObserver(updateVisibility);
        observer.observe(parentPanel, { attributes: true, attributeFilter: ["class"] });
        updateVisibility();
        cleanupSemantics = () => {
          observer.disconnect();
          delete wrapper.dataset.selectReady;
          if (tablist) {
            tablist.hidden = false;
            tablist.removeAttribute("aria-hidden");
          }
          panels.forEach((panel, index) => {
            const role = roles[index];
            if (role) panel.setAttribute("role", role);
            const labelId = labelledBy[index];
            if (labelId) panel.setAttribute("aria-labelledby", labelId);
          });
        };
      } else {
        const header = wrapper.querySelector<HTMLElement>(":scope > blume-tabs > div");
        if (header) {
          setPortalTarget(header);
          setIsActive(true);
        }
      }

      setOptions(nextOptions);
      setValue(initialValue(wrapper, group, nextOptions));
    };

    const synchronize = (event: Event) => {
      const detail = (event as CustomEvent<SelectionDetail>).detail;
      if (detail?.group === group && availableValues.has(detail.value)) setValue(detail.value);
    };

    initialize();
    window.addEventListener(selectionEvent, synchronize);
    return () => {
      disposed = true;
      cleanupSemantics?.();
      window.removeEventListener(selectionEvent, synchronize);
    };
  }, [group, wrapperId]);

  if (options.length < 2 || !value || !portalTarget || !isActive) return null;

  return createPortal(
    <div className="st-nested-select" data-nested-in-tab-bar="true" data-nested-tab-select={group}>
      <SelectField
        label={label}
        options={options}
        value={value}
        onValueChange={(nextValue) => dispatchSelection(group, nextValue)}
      />
    </div>,
    portalTarget,
  );
}
