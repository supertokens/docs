import { Flex, Card, Separator } from "@radix-ui/themes";

import "./styles.scss";

/*
 * Card abstraction used to render code samples sections
 * where you might need to change the content based on
 * differnt types of selections (npm/scriots, npm versions, node frameworks, etc)
 *
 * The component allows you to place two types of selections/inputs
 * in the card header.
 * This component should not be used directly in MDX files, but rather
 * in intermediate components that can be imported and used easily in
 * the final files.
 */
function CodeSampleCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<Card className="content-card" mb="4">
			{children}
		</Card>
	);
}

function CodeSampleCardHeader({ children }: React.PropsWithChildren<{}>) {
	return (
		<>
			<Flex direction="row" pt="3" pb="3" px="3">
				{children}
			</Flex>
			<Separator size="4" />
		</>
	);
}

const CodeSampleCardContent =
	(useGetValue: () => [string, (value: string) => void]) =>
	({ children, value }: React.PropsWithChildren<{ value: string }>) => {
		const [selectionValue] = useGetValue();

		if (selectionValue !== value) return null;

		return children;
	};

export const CodeSampleCard = Object.assign(CodeSampleCardRoot, {
	Content: CodeSampleCardContent,
	Header: CodeSampleCardHeader,
});
