import { Flex, Card, Separator, Select } from "@radix-ui/themes";
import { useCallback, useContext, useMemo } from "react";
import { DocItemContext } from "../DocItemContext";

const GoFrameworkOptions = [
	{ label: "Chi", value: "chi" },
	{ label: "net/http", value: "http" },
	{ label: "Gin", value: "gin" },
	{ label: "Mux", value: "mux" },
];

const DefaultGoFramework = "chi";

function GoFrameworksCardRoot({
	children,
	exclude,
}: React.PropsWithChildren<{ exclude?: string[] }>) {
	const { backend, onChangeBackendFramework } = useContext(DocItemContext);

	const packageManager = (backend.framework || DefaultGoFramework) as string;
	const onChange = useCallback(
		(value: string) => {
			// @ts-expect-error
			onChangeBackendFramework(value);
		},
		[backend],
	);

	const selectOptions = useMemo(() => {
		if (exclude)
			return GoFrameworkOptions.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return GoFrameworkOptions;
	}, [exclude]);

	return (
		<Card className="content-card" mb="4">
			<Flex gap="2" direction="row" pt="3" pb="3" px="3">
				<Select.Root value={packageManager} onValueChange={onChange}>
					<Select.Trigger />
					<Select.Content>
						{selectOptions.map((tabItem) => (
							<Select.Item value={tabItem.value}>{tabItem.label}</Select.Item>
						))}
					</Select.Content>
				</Select.Root>
			</Flex>
			<Separator size="4" />
			{children}
		</Card>
	);
}

function GoFrameworksCardContent({
	value,
	children,
}: React.PropsWithChildren<{ value: string }>) {
	const { backend } = useContext(DocItemContext);

	const framework = backend.framework || DefaultGoFramework;
	if (framework !== value) return null;

	return children;
}

export const GoFrameworksCard = Object.assign(GoFrameworksCardRoot, {
	Content: GoFrameworksCardContent,
});
