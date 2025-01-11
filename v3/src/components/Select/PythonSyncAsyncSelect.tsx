import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "@site/src/hooks";
import { useMemo } from "react";

const PythonSyncAsyncSelectionName = "python-sync-async";
const PythonSyncAsyncDefaultValue = "syncio";
const PythonFrameworksOptions = [
  { label: "asyncio", value: "asyncio" },
  { label: "syncio", value: "syncio" },
];

export function usePythonSyncAsyncSelection() {
  return useSelectionStore(PythonSyncAsyncSelectionName, PythonSyncAsyncDefaultValue);
}

export function PythonSyncAsyncSelect({ exclude }: { exclude?: string[] }) {
  const [value, setValue] = usePythonSyncAsyncSelection();
  const selectOptions = useMemo(() => {
    if (exclude) return PythonFrameworksOptions.filter((tabItem) => !exclude.includes(tabItem.value));
    return PythonFrameworksOptions;
  }, [exclude]);

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger />
      <Select.Content>
        {selectOptions.map((option) => (
          <Select.Item key={`${PythonSyncAsyncSelectionName}-${option.value}`} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
