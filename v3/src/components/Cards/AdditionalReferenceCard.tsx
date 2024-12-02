import { Card, Flex, Avatar, Text } from "@radix-ui/themes";

export function AdditionalReferenceCard({
	title,
	description,
	href,
}: {
	title: string;
	description: string;
	href: string;
}) {
	return (
		<Card asChild>
			<a href={href}>
				<Text as="div" size="4" weight="bold" mb="3">
					{title}
				</Text>
				<Text as="div" color="gray" size="2" style={{ marginBottom: 0 }}>
					{description}
				</Text>
			</a>
		</Card>
	);
}
