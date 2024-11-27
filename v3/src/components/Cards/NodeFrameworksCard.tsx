import { Flex, Card, Separator, Select } from "@radix-ui/themes";
import { useCallback, useContext, useMemo } from "react";
import { DocItemContext } from "../DocItemContext";

const NodeJSFrameworkSubTabItems = [
	{ label: "Express", value: "express" },
	{ label: "Hapi", value: "hapi" },
	{ label: "Fastify", value: "fastify" },
	{ label: "Koa", value: "koa" },
	{ label: "Loopback", value: "loopback" },
	{ label: "AWS Lambda / Netlify", value: "awsLambda" },
	{ label: "Next.js", value: "nextjs" },
	{ label: "NestJS", value: "nestjs" },
];

const DefaultNodeFramework = "express";

function NodeFrameworksCardRoot({
	children,
	exclude,
}: React.PropsWithChildren<{ exclude?: string[] }>) {
	const { backend, onChangeBackendFramework } = useContext(DocItemContext);

	const packageManager = (backend.framework || DefaultNodeFramework) as string;
	const onChange = useCallback(
		(value: string) => {
			// @ts-expect-error
			onChangeBackendFramework(value);
		},
		[backend],
	);

	const selectOptions = useMemo(() => {
		if (exclude)
			return NodeJSFrameworkSubTabItems.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return NodeJSFrameworkSubTabItems;
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

function NodeFrameworksCardContent({
	value,
	children,
}: React.PropsWithChildren<{ value: string }>) {
	const { backend } = useContext(DocItemContext);

	const framework = backend.framework || DefaultNodeFramework;
	if (framework !== value) return null;

	return children;
}

export const NodeFrameworksCard = Object.assign(NodeFrameworksCardRoot, {
	Content: NodeFrameworksCardContent,
});
