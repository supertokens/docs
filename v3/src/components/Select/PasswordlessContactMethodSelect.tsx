import { Select } from "@radix-ui/themes";
import { useCallback, useContext } from "react";

import { DocItemContext } from "../DocItemContext";

const SelectOptions = [
	{ value: "EMAIL", label: "Email" },
	{ value: "PHONE", label: "Phone" },
	{ value: "EMAIL_OR_PHONE", label: "Email or Phone" },
];

export const PasswordlessContactMethodSelect = () => {
	const { recipes, onChangeRecipeProperty } = useContext(DocItemContext);

	const contactMethod = recipes.passwordless.contactMethod;
	const onChange = useCallback(
		(value) => {
			onChangeRecipeProperty("passwordless", "contactMethod", value);
		},
		[onChangeRecipeProperty],
	);

	const valueLabel = SelectOptions.find(
		(option) => option.value === contactMethod,
	)?.label;

	return (
		<Select.Root value={contactMethod} onValueChange={onChange}>
			<Select.Trigger>Contact Method: {valueLabel}</Select.Trigger>
			<Select.Content>
				{SelectOptions.map((option) => (
					<Select.Item key={option.value} value={option.value}>
						{option.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>
	);
};
