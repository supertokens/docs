import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "@site/src/hooks";

const PythonPackageManagerSelectionName = "python-package-manager";
const PythonPackageManagerDefaultValue = "pip";

export function usePythonPackageManagerSelection() {
  return useSelectionStore(PythonPackageManagerSelectionName, PythonPackageManagerDefaultValue);
}

export function PythonPackageManagerSelect() {
  const [value, setValue] = usePythonPackageManagerSelection();

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="pip">pip</Select.Item>
        <Select.Item value="uv">uv</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
