import { Card, Flex, Avatar, Text } from "@radix-ui/themes";

import "./styles.scss";

function ReferenceCardRoot({
	children,
	href,
}: React.PropsWithChildren<{ href: string }>) {
	return (
		<Card className="reference-card">
			<a href={href}>
				<Flex gap="3" align="center">
					{children}
				</Flex>
			</a>
		</Card>
	);
}

function ReferenceCardAvatar({ icon }: { icon: string }) {
	return (
		<Avatar
			src={`/img/icons/${icon}.svg`}
			alt="Icon"
			size="3"
			className="reference-card__avatar"
			radius="full"
			fallback="T"
		/>
	);
}

function ReferenceCardTitle({ children }: React.PropsWithChildren<{}>) {
	return (
		<Text as="div" size="4" weight="bold">
			{children}
		</Text>
	);
}

function ReferenceCardDescription({ children }: React.PropsWithChildren<{}>) {
	return (
		<Text as="div" size="2" color="gray">
			{children}
		</Text>
	);
}

export const ReferenceCard = Object.assign(ReferenceCardRoot, {
	Avatar: ReferenceCardAvatar,
	Title: ReferenceCardTitle,
	Description: ReferenceCardDescription,
});
