import { Flex, Card, Separator, Select } from "@radix-ui/themes";
import { useContext } from "react";

import { CardContext, CardContextProvider } from "./CardContext";

import "./styles.scss";

function NpmOrScriptsCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CardContextProvider defaultValue="npm">
			<NpmOrScriptsCardComponent>{children}</NpmOrScriptsCardComponent>
		</CardContextProvider>
	);
}

function NpmOrScriptsCardComponent({ children }: React.PropsWithChildren<{}>) {
	const { value, setValue } = useContext(CardContext);

	return (
		<Card className="content-card" mb="4">
			<Flex gap="2" direction="row" pt="3" pb="3" px="3">
				<Select.Root value={value} onValueChange={setValue}>
					<Select.Trigger />
					<Select.Content>
						<Select.Item value="npm">Via NPM</Select.Item>
						<Select.Item value="scripts">Via Scripts</Select.Item>
					</Select.Content>
				</Select.Root>
			</Flex>
			<Separator size="4" />
			{children}
		</Card>
	);
}

function NpmOrScriptsCardContent({
	value,
	children,
}: React.PropsWithChildren<{ value: string }>) {
	const { value: contextValue } = useContext(CardContext);

	if (contextValue !== value) return null;

	return children;
}

export const NpmOrScriptsCard = Object.assign(NpmOrScriptsCardRoot, {
	Content: NpmOrScriptsCardContent,
});
