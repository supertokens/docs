import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "../../lib/selectionStore";
import { useMemo } from "react";

const NodeFrameworksSelectionName = "node-frameworks";
const NodeFrameworksDefaultValue = "express";

const NodeFrameworksOptions = [
	{ label: "Express", value: "express" },
	{ label: "Hapi", value: "hapi" },
	{ label: "Fastify", value: "fastify" },
	{ label: "Koa", value: "koa" },
	{ label: "Loopback", value: "loopback" },
	{ label: "AWS Lambda / Netlify", value: "awsLambda" },
	{ label: "Next.js", value: "nextjs" },
	{ label: "NestJS", value: "nestjs" },
];

export function useNodeFrameworksSelection() {
	return useSelectionStore(
		NodeFrameworksSelectionName,
		NodeFrameworksDefaultValue,
	);
}

export function NodeFrameworksSelect({ exclude }: { exclude?: string[] }) {
	const [value, setValue] = useNodeFrameworksSelection();
	const selectOptions = useMemo(() => {
		if (exclude)
			return NodeFrameworksOptions.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return NodeFrameworksOptions;
	}, [exclude]);

	return (
		<Select.Root value={value} onValueChange={setValue}>
			<Select.Trigger />
			<Select.Content>
				{selectOptions.map((option) => (
					<Select.Item
						key={`${NodeFrameworksSelectionName}-${option.value}`}
						value={option.value}
					>
						{option.label}
					</Select.Item>
				))}
			</Select.Content>
		</Select.Root>
	);
}
