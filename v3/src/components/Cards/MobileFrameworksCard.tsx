import { Flex, Card, Separator, Select } from "@radix-ui/themes";
import { useContext, useMemo } from "react";
import { CardContext, CardContextProvider } from "./CardContext";

const MobileFrameworkSubTabItems = [
	{ label: "React Native", value: "reactnative" },
	{ label: "Android", value: "android" },
	{ label: "iOS", value: "ios" },
	{ label: "Flutter", value: "flutter" },
];

function MobileFrameworksCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CardContextProvider defaultValue="reactnative">
			<MobileFrameworksCardComponent>{children}</MobileFrameworksCardComponent>
		</CardContextProvider>
	);
}

function MobileFrameworksCardComponent({
	children,
	exclude,
}: React.PropsWithChildren<{ exclude?: string[] }>) {
	const { value, setValue } = useContext(CardContext);

	const selectOptions = useMemo(() => {
		if (exclude)
			return MobileFrameworkSubTabItems.filter(
				(tabItem) => !exclude.includes(tabItem.value),
			);
		return MobileFrameworkSubTabItems;
	}, [exclude]);

	return (
		<Card className="content-card" mb="4">
			<Flex gap="2" direction="row" pt="3" pb="3" px="3">
				<Select.Root value={value} onValueChange={setValue}>
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

function MobileFrameworksCardContent({
	value,
	children,
}: React.PropsWithChildren<{ value: string }>) {
	const { value: contextValue } = useContext(CardContext);

	if (contextValue !== value) return null;

	return children;
}

export const MobileFrameworksCard = Object.assign(MobileFrameworksCardRoot, {
	Content: MobileFrameworksCardContent,
});
