import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "../../lib/selectionStore";
import { useMemo } from "react";

const PythonFrameworksSelectionName = "python-framework";
const PythonFrameworksDefaultValue = "fastapi";
const PythonFrameworksOptions = [
	{ label: "FastAPI", value: "fastapi" },
	{ label: "Flask", value: "flask" },
	{ label: "Django", value: "django" },
];

export function usePythonFrameworksSelection() {
	return useSelectionStore(
		PythonFrameworksSelectionName,
		PythonFrameworksDefaultValue,
	);
}

export function PythonFrameworksSelect({ exclude }: { exclude?: string[] }) {
	const [value, setValue] = usePythonFrameworksSelection();

	const selectOptions = useMemo(() => {
		if (exclude)
			return PythonFrameworksOptions.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return PythonFrameworksOptions;
	}, [exclude]);

	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger />
			<Select.Content>
				{selectOptions.map((option) => (
					<Select.Item
						key={`${PythonFrameworksSelectionName}-${option.value}`}
						value={option.value}
					>
						{option.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>
	);
}
