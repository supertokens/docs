import { useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";

declare global {
  interface Window {
    posthog?: { capture: (event: string, properties?: Record<string, unknown>) => void };
  }
}
import {
  CheckIcon,
  ChevronDownIcon,
  Code2Icon,
  LayoutTemplateIcon,
  MonitorIcon,
  SmartphoneIcon,
  type LucideIcon,
} from "lucide-react";

import type { TabGroup } from "@/components/tab-groups";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import type { SelectOption } from "@/components/ui/select-field";
import {
  dispatchSelection,
  dispatchVariant,
  optionsForGroup,
  readStorage,
  selectedGroupValue,
  selectionEvent,
  variantEvent,
} from "@/lib/docs-selection";

interface PreferenceRow {
  group?: TabGroup;
  key: string;
  label: string;
  options: SelectOption[];
  value: string;
  variantKey?: string;
}

interface OptionPresentation {
  icon?: LucideIcon;
  logo?: string;
}

interface SummaryRow {
  category: string;
  key: string;
  label: string;
  presentation?: OptionPresentation;
}

const uiTypeOptions = [
  { value: "prebuilt", label: "Pre-built UI" },
  { value: "custom", label: "Custom UI" },
];

const optionDescriptions: Record<string, string> = {
  prebuilt: "Drop-in components that handle the flows for you.",
  custom: "Build your own UI and call the SDK directly.",
};

const assetBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/`;

const optionPresentations: Record<string, OptionPresentation> = {
  prebuilt: { icon: LayoutTemplateIcon },
  custom: { icon: Code2Icon },
  web: { icon: MonitorIcon },
  mobile: { icon: SmartphoneIcon },
  reactjs: { logo: "img/logos/react.svg" },
  angular: { logo: "img/logos/angular.svg" },
  vue: { logo: "img/logos/vue.svg" },
  webjs: { logo: "img/logos/js.svg" },
  reactnative: { logo: "img/icons/react.svg" },
  android: { logo: "img/logos/android.svg" },
  ios: { logo: "img/logos/ios.svg" },
  flutter: { logo: "img/icons/flutter.svg" },
  nodejs: { logo: "img/logos/node.svg" },
  go: { logo: "img/logos/go-wordmark.svg" },
  python: { logo: "img/logos/python.svg" },
  nestjs: { logo: "img/logos/nestjs.svg" },
  "aws-lambda": { logo: "img/logos/aws-lambda.svg" },
  nextjs: { logo: "img/logos/nextjs.svg" },
  fastapi: { logo: "img/logos/fastapi.svg" },
  django: { logo: "img/logos/django.svg" },
  express: { logo: "img/logos/express.svg" },
};

function tabPreference(key: string, label: string, group: TabGroup | undefined): PreferenceRow | undefined {
  if (!group) return undefined;
  const options = optionsForGroup(group);
  const value = selectedGroupValue(group, options);
  if (options.length < 2 || !value) return undefined;
  return { key, label, group, options, value };
}

function getPreferences(): PreferenceRow[] {
  const rows: Array<PreferenceRow | undefined> = [];
  const hasUiVariants = Boolean(document.querySelector('[data-variant-content="ui-type"]'));
  const uiType = readStorage("supertokens-docs:ui-type") === "custom" ? "custom" : "prebuilt";

  if (hasUiVariants) {
    rows.push({
      key: "ui-type",
      label: "UI",
      options: uiTypeOptions,
      value: uiType,
      variantKey: "ui-type",
    });
  }

  const prebuiltOptions = optionsForGroup("frontend-prebuilt-ui");
  const customOptions = optionsForGroup("frontend-custom-ui");
  const platformOptions = optionsForGroup("frontend-platforms");
  const frontendGroup: TabGroup | undefined =
    uiType === "custom" && customOptions.length > 1
      ? "frontend-custom-ui"
      : prebuiltOptions.length > 1
        ? "frontend-prebuilt-ui"
        : customOptions.length > 1
          ? "frontend-custom-ui"
          : platformOptions.length > 1
            ? "frontend-platforms"
            : undefined;
  const frontend = tabPreference("frontend", "Frontend", frontendGroup);
  rows.push(frontend);
  if (frontendGroup === "frontend-custom-ui" && frontend?.value === "mobile") {
    rows.push(tabPreference("frontend-framework", "Mobile framework", "mobile-frameworks"));
  }

  const backend = tabPreference("backend", "Backend", "backend-language");
  rows.push(backend);
  const frameworkGroups: Partial<Record<string, TabGroup>> = {
    nodejs: "node-frameworks",
    go: "go-frameworks",
    python: "python-frameworks",
  };
  rows.push(
    tabPreference(
      "backend-framework",
      `${backend?.label || "Backend"} framework`,
      frameworkGroups[backend?.value || ""],
    ),
  );

  return rows.filter((row): row is PreferenceRow => Boolean(row));
}

function selectedOption(row: PreferenceRow | undefined): SelectOption | undefined {
  return row?.options.find((option) => option.value === row.value);
}

function buildSummary(rows: PreferenceRow[]): SummaryRow[] {
  const summary: SummaryRow[] = [];
  const ui = rows.find((row) => row.key === "ui-type");
  const frontend = rows.find((row) => row.key === "frontend");
  const frontendFramework = rows.find((row) => row.key === "frontend-framework");
  const backend = rows.find((row) => row.key === "backend");
  const backendFramework = rows.find((row) => row.key === "backend-framework");

  const uiOption = selectedOption(ui);
  if (ui && uiOption) {
    summary.push({
      key: ui.key,
      category: ui.label,
      label: uiOption.label,
      presentation: optionPresentations[uiOption.value],
    });
  }

  const frontendOption = selectedOption(frontend);
  const frontendFrameworkOption = selectedOption(frontendFramework);
  if (frontend && frontendOption) {
    summary.push({
      key: frontend.key,
      category: frontend.label,
      label: frontendFrameworkOption
        ? `${frontendOption.label} · ${frontendFrameworkOption.label}`
        : frontendOption.label,
      presentation:
        optionPresentations[frontendFrameworkOption?.value || ""] || optionPresentations[frontendOption.value],
    });
  }

  const backendOption = selectedOption(backend);
  const backendFrameworkOption = selectedOption(backendFramework);
  if (backend && backendOption) {
    summary.push({
      key: backend.key,
      category: backend.label,
      label: backendFrameworkOption ? `${backendOption.label} · ${backendFrameworkOption.label}` : backendOption.label,
      presentation:
        optionPresentations[backendFrameworkOption?.value || ""] || optionPresentations[backendOption.value],
    });
  }

  return summary;
}

function OptionMark({ label, presentation }: { label: string; presentation?: OptionPresentation }) {
  const Icon = presentation?.icon;
  const logoStyle = presentation?.logo
    ? ({ "--preferences-option-logo": `url("${assetBase}${presentation.logo}")` } as CSSProperties)
    : undefined;
  return (
    <span className="preferences-option-mark" aria-hidden="true">
      {Icon ? (
        <Icon />
      ) : presentation?.logo ? (
        <span className="preferences-option-logo" style={logoStyle} />
      ) : (
        <span>{label.slice(0, 2)}</span>
      )}
    </span>
  );
}

function PreferenceOption({
  groupName,
  mode,
  onSelect,
  option,
  selected,
}: {
  groupName: string;
  mode: "row" | "tile";
  onSelect: () => void;
  option: SelectOption;
  selected: boolean;
}) {
  return (
    <label className="preferences-option" data-mode={mode} data-selected={selected || undefined}>
      <input type="radio" name={groupName} value={option.value} checked={selected} onChange={onSelect} />
      <OptionMark label={option.label} presentation={optionPresentations[option.value]} />
      <span className="preferences-option-copy">
        <span className="preferences-option-label">{option.label}</span>
        {optionDescriptions[option.value] ? (
          <span className="preferences-option-description">{optionDescriptions[option.value]}</span>
        ) : null}
      </span>
      {mode === "row" && selected ? <CheckIcon className="preferences-option-check" aria-hidden="true" /> : null}
    </label>
  );
}

function PreferenceFieldset({
  groupName,
  mode,
  onSelect,
  row,
  secondary = false,
}: {
  groupName: string;
  mode: "row" | "tile";
  onSelect: (row: PreferenceRow, value: string) => void;
  row: PreferenceRow;
  secondary?: boolean;
}) {
  return (
    <fieldset className="preferences-group" data-secondary={secondary || undefined}>
      <legend>{row.label}</legend>
      <div className="preferences-options" data-mode={mode}>
        {row.options.map((option) => (
          <PreferenceOption
            key={option.value}
            groupName={`${groupName}-${row.key}`}
            mode={mode}
            option={option}
            selected={row.value === option.value}
            onSelect={() => onSelect(row, option.value)}
          />
        ))}
      </div>
    </fieldset>
  );
}

function PreferenceSection({ children }: { children: ReactNode }) {
  return <div className="preferences-section">{children}</div>;
}

export default function DocsPreferences() {
  const headingId = useId();
  const radioGroupName = useId();
  const [rows, setRows] = useState<PreferenceRow[]>([]);

  useEffect(() => {
    const refresh = () => queueMicrotask(() => setRows(getPreferences()));
    setRows(getPreferences());
    window.addEventListener(selectionEvent, refresh);
    window.addEventListener(variantEvent, refresh);
    document.addEventListener("astro:page-load", refresh);
    return () => {
      window.removeEventListener(selectionEvent, refresh);
      window.removeEventListener(variantEvent, refresh);
      document.removeEventListener("astro:page-load", refresh);
    };
  }, []);

  if (rows.length === 0) return null;

  const ui = rows.find((row) => row.key === "ui-type");
  const frontend = rows.find((row) => row.key === "frontend");
  const frontendFramework = rows.find((row) => row.key === "frontend-framework");
  const backend = rows.find((row) => row.key === "backend");
  const backendFramework = rows.find((row) => row.key === "backend-framework");
  const summary = buildSummary(rows);
  const summaryLabel = summary.map((row) => `${row.category}: ${row.label}`).join(", ");
  const selectPreference = (row: PreferenceRow, value: string) => {
    if (row.variantKey) dispatchVariant(row.variantKey, value);
    else if (row.group) dispatchSelection(row.group, value);
    window.posthog?.capture("docs_preference_changed", { preference: row.key, value });
  };

  return (
    <section className="docs-preferences" data-docs-preferences aria-labelledby={headingId}>
      <h2 id={headingId} className="sr-only">
        Example preferences
      </h2>
      <Popover>
        <PopoverTrigger
          render={
            <button
              type="button"
              className="preferences-trigger"
              aria-label={`Configure example preferences. Current: ${summaryLabel}`}
            />
          }
        >
          <span className="preferences-summary">
            {summary.map((row) => (
              <span key={row.key} className="preferences-summary-row">
                <OptionMark label={row.label} presentation={row.presentation} />
                <span className="preferences-summary-copy">
                  <span className="preferences-summary-category">{row.category}</span>
                  <span className="preferences-summary-value">{row.label}</span>
                </span>
              </span>
            ))}
          </span>
          <ChevronDownIcon className="preferences-chevron" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={4} className="preferences-popover">
          <div className="preferences-popover-header">
            <PopoverTitle>Your Setup</PopoverTitle>
          </div>
          <div className="preferences-popover-body">
            {ui ? (
              <PreferenceSection>
                <PreferenceFieldset groupName={radioGroupName} mode="row" row={ui} onSelect={selectPreference} />
              </PreferenceSection>
            ) : null}
            {frontend ? (
              <PreferenceSection>
                <PreferenceFieldset groupName={radioGroupName} mode="tile" row={frontend} onSelect={selectPreference} />
                {frontendFramework ? (
                  <PreferenceFieldset
                    groupName={radioGroupName}
                    mode="tile"
                    row={frontendFramework}
                    secondary
                    onSelect={selectPreference}
                  />
                ) : null}
              </PreferenceSection>
            ) : null}
            {backend ? (
              <PreferenceSection>
                <PreferenceFieldset groupName={radioGroupName} mode="row" row={backend} onSelect={selectPreference} />
                {backendFramework ? (
                  <PreferenceFieldset
                    groupName={radioGroupName}
                    mode="tile"
                    row={backendFramework}
                    secondary
                    onSelect={selectPreference}
                  />
                ) : null}
              </PreferenceSection>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>
    </section>
  );
}
