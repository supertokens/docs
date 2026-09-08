import { tabGroupDefault, tabGroupNames, tabGroups, type TabGroup } from "../components/tab-groups";

export interface ParsedCodeOption {
  group: TabGroup;
  value: string;
}

export interface SecondarySelection {
  group: TabGroup;
  invalid: boolean;
  value?: string;
}

export function parseCodeOption(option: string | undefined): ParsedCodeOption | undefined {
  if (!option) return undefined;
  const separator = option.indexOf(":");
  const group = option.slice(0, separator) as TabGroup;
  const value = option.slice(separator + 1);
  if (
    separator < 1 ||
    option.indexOf(":", separator + 1) !== -1 ||
    !tabGroupNames.includes(group) ||
    !value ||
    !Object.values(tabGroups[group].options as Record<string, string>).includes(value)
  ) {
    return undefined;
  }
  return { group, value };
}

export function resolveSecondarySelection(
  options: (string | undefined)[],
  storedValue?: string | null,
): SecondarySelection | undefined {
  const declared = options.filter((option): option is string => Boolean(option));
  if (declared.length === 0) return undefined;
  if (declared.length !== options.length) return { group: tabGroupNames[0], invalid: true };
  const parsed = declared.map(parseCodeOption);
  if (parsed.some((option) => !option)) return { group: tabGroupNames[0], invalid: true };

  const valid = parsed.filter((option): option is ParsedCodeOption => Boolean(option));
  const groups = new Set(valid.map((option) => option.group));
  const group = valid[0].group;
  if (groups.size !== 1) return { group, invalid: true };

  const values = new Set(valid.map((option) => option.value));
  const defaultValue = tabGroupDefault(group);
  return {
    group,
    invalid: false,
    value:
      storedValue && values.has(storedValue)
        ? storedValue
        : values.has(defaultValue)
          ? defaultValue
          : values.values().next().value,
  };
}
