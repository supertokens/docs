import { useCallback, useContext } from "react";
import { DocItemContext } from "../DocItemContext";
import { Flex, Text, Card, Heading, RadioCards } from "@radix-ui/themes";

export function PasswordlessRecipeForm() {
	const { recipes, onChangeRecipeProperty } = useContext(DocItemContext);

	const { passwordless } = recipes;
	const onChangeContactMethod = useCallback(
		(e) => {
			onChangeRecipeProperty("passwordless", "contactMethod", e.target.value);
		},
		[onChangeRecipeProperty],
	);

	return (
		<Flex gap="2" direction="column" mb="6" py="5" px="4" asChild>
			<Card>
				<Heading as="h3" size="5">
					How do you identify your users?
				</Heading>
				<Flex direction="row" gap="2">
					<RadioCards.Root
						defaultValue={passwordless.contactMethod}
						columns={{ initial: "1", sm: "2", lg: "3" }}
					>
						<RadioCards.Item value="PHONE" onClick={onChangeContactMethod}>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Only Phone Number</Text>
							</Flex>
						</RadioCards.Item>
						<RadioCards.Item value="EMAIL" onClick={onChangeContactMethod}>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Only Email</Text>
							</Flex>
						</RadioCards.Item>
						<RadioCards.Item
							value="EMAIL_OR_PHONE"
							onClick={onChangeContactMethod}
						>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Email or Phone Number</Text>
							</Flex>
						</RadioCards.Item>
					</RadioCards.Root>
				</Flex>
			</Card>
		</Flex>
	);
}
