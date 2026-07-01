import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "@site/src/hooks";

const NodePackageManagerSelectioName = "node-package-manager";
const NodePackageManagerDefaultValue = "npm";

export function useNodePackageManagerSelection() {
  return useSelectionStore(NodePackageManagerSelectioName, NodePackageManagerDefaultValue);
}

export function NodePackageManagerSelect() {
  const [value, setValue] = useNodePackageManagerSelection();
  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="npm">npm</Select.Item>
        <Select.Item value="yarn">yarn</Select.Item>
        <Select.Item value="pnpm">pnpm</Select.Item>
        <Select.Item value="bun">bun</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
