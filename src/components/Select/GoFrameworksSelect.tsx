import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "@site/src/hooks";
import { useMemo } from "react";

const GoFrameworksSelectionName = "go-framework";
const GoFrameworksDefaultValue = "chi";

const GoFrameworkOptions = [
  { label: "Chi", value: "chi" },
  { label: "net/http", value: "http" },
  { label: "Gin", value: "gin" },
  { label: "Mux", value: "mux" },
];

export function useGoFrameworksSelection() {
  return useSelectionStore(GoFrameworksSelectionName, GoFrameworksDefaultValue);
}

export function GoFrameworksSelect({ exclude }: { exclude?: string[] }) {
  const [value, setValue] = useGoFrameworksSelection();
  const selectOptions = useMemo(() => {
    if (exclude) return GoFrameworkOptions.filter((tabItem) => !exclude.includes(tabItem.value));
    return GoFrameworkOptions;
  }, [exclude]);

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger />
      <Select.Content>
        {selectOptions.map((option) => (
          <Select.Item key={`${GoFrameworksSelectionName}-${option.value}`} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
