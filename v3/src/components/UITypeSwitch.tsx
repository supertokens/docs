import React, { useContext } from "react";
import { DocItemContext } from "./DocItemContext";
import { Card, Flex, Heading, RadioCards, Text } from "@radix-ui/themes";

function UITypeSwitch({}) {
	const { uiType, onChangeUIType } = useContext(DocItemContext);

	return (
		<Flex gap="2" direction="column" mb="6" py="5" px="4" asChild>
			<Card>
				<Heading as="h3" size="5">
					What type of UI are you using?
				</Heading>
				<Flex direction="row" gap="2" align="start">
					<RadioCards.Root
						defaultValue={uiType}
						columns={{ initial: "1", sm: "2" }}
					>
						<RadioCards.Item
							value="prebuilt"
							onClick={() => onChangeUIType("prebuilt")}
						>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Pre-Built UI</Text>
								<Text>Authentication UI provided by SuperTokens</Text>
							</Flex>
						</RadioCards.Item>
						<RadioCards.Item
							value="custom"
							onClick={() => onChangeUIType("custom")}
						>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Custom UI</Text>
								<Text>Authentication UI created by you</Text>
							</Flex>
						</RadioCards.Item>
					</RadioCards.Root>
				</Flex>
			</Card>
		</Flex>
	);
}

function HeadingFilter({
	children,
	name,
}: React.PropsWithChildren<{ name: string }>) {
	return <div data-heading-filter={name}>{children}</div>;
}

function PrebuiltUIContent({ children }: React.PropsWithChildren<{}>) {
	const state = useContext(DocItemContext);

	return (
		<HeadingFilter name="prebuilt">
			{state.uiType === "prebuilt" ? children : null}
		</HeadingFilter>
	);
}

function CustomUIContent({ children }: React.PropsWithChildren<{}>) {
	const state = useContext(DocItemContext);

	return (
		<HeadingFilter name="custom">
			{state.uiType === "custom" ? children : null}
		</HeadingFilter>
	);
}

export const UIType = {
	Switch: UITypeSwitch,
	PrebuiltUIContent,
	CustomUIContent,
};
