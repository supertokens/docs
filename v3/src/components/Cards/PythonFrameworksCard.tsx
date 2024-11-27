import { Flex, Card, Separator, Select } from "@radix-ui/themes";
import { useCallback, useContext, useMemo } from "react";
import { DocItemContext } from "../DocItemContext";

const PythonFrameworkOptions = [
	{ label: "FastAPI", value: "fastapi" },
	{ label: "Flask", value: "flask" },
	{ label: "Django", value: "django" },
];

const DefaultPythonFramework = "fastapi";

function PythonFrameworksCardRoot({
	children,
	exclude,
}: React.PropsWithChildren<{ exclude?: string[] }>) {
	const { backend, onChangeBackendFramework } = useContext(DocItemContext);

	const packageManager = (backend.framework ||
		DefaultPythonFramework) as string;
	const onChange = useCallback(
		(value) => {
			onChangeBackendFramework(value);
		},
		[backend],
	);

	const selectOptions = useMemo(() => {
		if (exclude)
			return PythonFrameworkOptions.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return PythonFrameworkOptions;
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

function PythonFrameworksCardContent({
	value,
	children,
}: React.PropsWithChildren<{ value: string }>) {
	const { backend } = useContext(DocItemContext);

	const framework = backend.framework || DefaultPythonFramework;
	if (framework !== value) return null;

	return children;
}

export const PythonFrameworksCard = Object.assign(PythonFrameworksCardRoot, {
	Content: PythonFrameworksCardContent,
});
