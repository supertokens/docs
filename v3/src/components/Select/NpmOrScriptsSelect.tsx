import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "../../lib/selectionStore";

const NpmOrScriptsSelectionName = "npm-or-scripts";
const NpmOrScriptsDefaultValue = "npm";

export function useNpmOrScriptsSelection() {
	return useSelectionStore(NpmOrScriptsSelectionName, NpmOrScriptsDefaultValue);
}

export function NpmOrScriptsSelect() {
	const [value, setValue] = useNpmOrScriptsSelection();

	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger />
			<Select.Content>
				<Select.Item value="npm">Via NPM</Select.Item>
				<Select.Item value="scripts">Via Scripts</Select.Item>
			</Select.Content>
		</Select.Root>
	);
}
