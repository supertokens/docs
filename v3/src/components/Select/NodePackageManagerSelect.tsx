import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "../../lib/selectionStore";

const NodePackageManagerSelectioName = "node-package-manager";
const NodePackageManagerDefaultValue = "npm7+";

export function useNodePackageManagerSelection() {
	return useSelectionStore(
		NodePackageManagerSelectioName,
		NodePackageManagerDefaultValue,
	);
}

export function NodePackageManagerSelect() {
	const [value, setValue] = useNodePackageManagerSelection();
	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger />
			<Select.Content>
				<Select.Item value="npm7+">{`NPM>=7`}</Select.Item>
				<Select.Item value="npm6">{`NPM6`}</Select.Item>
				<Select.Item value="yarn">Yarn</Select.Item>
			</Select.Content>
		</Select.Root>
	);
}