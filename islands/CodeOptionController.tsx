import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { PresentedOption } from "@/components/option-presentation";
import { tabGroupLabel, tabGroups, type TabGroup } from "@/components/tab-groups";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import {
  directPanels,
  dispatchSelection,
  readStorage,
  selectionContentReadyEvent,
  selectionEvent,
  selectionReadyEvent,
  selectionStorageKey,
  type SelectionDetail,
} from "@/lib/docs-selection";
import { parseCodeOption, resolveSecondarySelection } from "@/lib/code-group-options";

interface Props {
  passive: boolean;
  wrapperId: string;
}

interface CodeSurface {
  element: HTMLElement;
  group?: TabGroup;
  invalid?: boolean;
  value?: string;
}

interface State {
  group: TabGroup;
  host: HTMLElement;
  options: SelectOption[];
  value: string;
}

function parseSurface(element: HTMLElement): CodeSurface {
  const option = element.dataset.codeOption;
  if (!option) return { element };
  const parsed = parseCodeOption(option);
  return parsed ? { element, ...parsed } : { element, invalid: true };
}

function surfacesForPanel(panel: HTMLElement): CodeSurface[] {
  return [...panel.querySelectorAll<HTMLElement>(":scope > pre, :scope > figure")].map(parseSurface);
}

function setVisibleSurfaces(surfaces: CodeSurface[], group: TabGroup, value: string): boolean {
  const available = surfaces.some((surface) => surface.group === group && surface.value === value);
  for (const surface of surfaces) {
    surface.element.hidden = Boolean(surface.group && (surface.group !== group || surface.value !== value));
  }
  return available;
}

export default function CodeOptionController({ passive, wrapperId }: Props) {
  const [state, setState] = useState<State>();

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    void customElements.whenDefined("blume-tabs").then(() => {
      if (cancelled) return;
      const wrapper = document.getElementById(wrapperId);
      const hostId = wrapper?.dataset.docsSelectionAccessoryHostId;
      const host = hostId ? document.getElementById(hostId) : null;
      if (!wrapper || !host) return;

      const update = () => {
        const panel = directPanels(wrapper).find((candidate) => !candidate.classList.contains("hidden"));
        if (!panel) {
          setState(undefined);
          wrapper.dataset.docsPassiveCodeResolved = "true";
          if (passive) wrapper.hidden = true;
          document.dispatchEvent(new CustomEvent(selectionContentReadyEvent));
          return;
        }
        const surfaces = surfacesForPanel(panel);
        const storedOptions = surfaces.map((surface) => surface.element.dataset.codeOption);
        const initialGroup = surfaces.find((surface) => surface.group)?.group;
        const stored = initialGroup ? readStorage(selectionStorageKey(initialGroup)) : undefined;
        const selection = resolveSecondarySelection(storedOptions, stored);
        panel.toggleAttribute("data-docs-code-option-invalid", Boolean(selection?.invalid));
        if (!selection || selection.invalid || !selection.value) {
          for (const surface of surfaces) surface.element.hidden = false;
          setState(undefined);
          wrapper.dataset.docsPassiveCodeResolved = "true";
          if (passive) wrapper.hidden = Boolean(selection?.invalid);
          document.dispatchEvent(new CustomEvent(selectionContentReadyEvent));
          return;
        }
        const { group, value } = selection;
        const choices = new Map<string, string>();
        for (const surface of surfaces) {
          if (surface.group !== group || !surface.value) continue;
          const title = Object.entries(tabGroups[group].options as Record<string, string>).find(
            ([, candidate]) => candidate === surface.value,
          )?.[0];
          choices.set(surface.value, title ?? surface.value);
        }
        if (passive && stored && stored !== value) {
          for (const surface of surfaces) {
            if (surface.group) surface.element.hidden = true;
          }
          setState(undefined);
          wrapper.dataset.docsPassiveCodeResolved = "true";
          wrapper.hidden = true;
          document.dispatchEvent(new CustomEvent(selectionContentReadyEvent));
          return;
        }
        setVisibleSurfaces(surfaces, group, value);
        panel.toggleAttribute("data-docs-secondary-selection-unavailable", Boolean(stored && stored !== value));
        wrapper.dataset.docsPassiveCodeResolved = "true";
        if (passive) wrapper.hidden = false;
        document.dispatchEvent(new CustomEvent(selectionContentReadyEvent));
        setState({
          group,
          host,
          options: [...choices].map(([optionValue, label]) => ({ value: optionValue, label })),
          value,
        });
      };
      const synchronize = (event: Event) => {
        const detail = (event as CustomEvent<SelectionDetail>).detail;
        if (!detail) return;
        update();
      };
      const synchronizeStorage = (event: StorageEvent) => {
        if (event.key?.startsWith("supertokens-docs:selection:")) update();
      };
      wrapper.addEventListener("click", update);
      wrapper.addEventListener("keydown", update);
      window.addEventListener(selectionEvent, synchronize);
      window.addEventListener("storage", synchronizeStorage);
      document.addEventListener(selectionReadyEvent, update);
      update();
      cleanup = () => {
        delete wrapper.dataset.docsPassiveCodeResolved;
        wrapper.removeEventListener("click", update);
        wrapper.removeEventListener("keydown", update);
        window.removeEventListener(selectionEvent, synchronize);
        window.removeEventListener("storage", synchronizeStorage);
        document.removeEventListener(selectionReadyEvent, update);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [passive, wrapperId]);

  if (passive || !state || state.options.length < 2) return null;

  return createPortal(
    <div className="st-secondary-choice" data-secondary-choice={state.group}>
      <SelectField
        label={tabGroupLabel(state.group)}
        options={state.options}
        renderOption={(option) => <PresentedOption label={option.label} value={option.value} />}
        value={state.value}
        onValueChange={(value) => dispatchSelection(state.group, value)}
      />
    </div>,
    state.host,
  );
}
