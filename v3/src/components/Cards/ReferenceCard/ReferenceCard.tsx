import React from "react";
import { Card, Flex, Avatar, Grid, Box, Text } from "@radix-ui/themes";

import "./styles.scss";

function ReferenceCardRoot({
	children,
	href,
}: React.PropsWithChildren<{ href: string }>) {
	const hasAvatarInChildren = React.Children.toArray(children).some((child) => {
		if (React.isValidElement(child)) {
			return child.type === ReferenceCardAvatar;
		}
		return false;
	});

	if (hasAvatarInChildren) {
		return (
			<Box p="4" asChild>
				<Card className="reference-card" asChild>
					<a href={href}>
						<Flex gap="3" align="center">
							{children}
						</Flex>
					</a>
				</Card>
			</Box>
		);
	}

	return (
		<Box p="5" asChild>
			<Card className="reference-card" asChild>
				<a href={href}>
					<Flex gap="3" direction="column">
						{children}
					</Flex>
				</a>
			</Card>
		</Box>
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
		<Text className="reference-card__title" asChild size="4" weight="bold">
			{children}
		</Text>
	);
}

function ReferenceCardDescription({ children }: React.PropsWithChildren<{}>) {
	return (
		<Text className="reference-card__description" asChild size="2" color="gray">
			{children}
		</Text>
	);
}

function ReferenceCardGrid({ children }: React.PropsWithChildren<{}>) {
	return (
		<Grid columns="repeat(3, 1fr)" gap="4">
			{children}
		</Grid>
	);
}

export const ReferenceCard = Object.assign(ReferenceCardRoot, {
	Avatar: ReferenceCardAvatar,
	Title: ReferenceCardTitle,
	Description: ReferenceCardDescription,
	Grid: ReferenceCardGrid,
});
