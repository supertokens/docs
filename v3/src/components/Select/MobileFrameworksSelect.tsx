import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "../../lib/selectionStore";
import { useMemo } from "react";

const MobileFrameworksSelectionName = "mobile-frameworks";
const MobileFrameworksDefaultValue = "reactnative";

const MobileFrameworksOptions = [
	{ label: "React Native", value: "reactnative" },
	{ label: "Android", value: "android" },
	{ label: "iOS", value: "ios" },
	{ label: "Flutter", value: "flutter" },
];

export function useMobileFrameworksSelection() {
	return useSelectionStore(
		MobileFrameworksSelectionName,
		MobileFrameworksDefaultValue,
	);
}

export function MobileFrameworksSelect({ exclude }: { exclude?: string[] }) {
	const [value, setValue] = useMobileFrameworksSelection();
	const selectOptions = useMemo(() => {
		if (exclude)
			return MobileFrameworksOptions.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return MobileFrameworksOptions;
	}, [exclude]);

	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger />
			<Select.Content>
				{selectOptions.map((option) => (
					<Select.Item
						key={`${MobileFrameworksSelectionName}-${option.value}`}
						value={option.value}
					>
						{option.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>
	);
}
