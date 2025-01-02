import React, { useCallback } from "react";
import { Card, Flex, Avatar, Grid, Box, Text } from "@radix-ui/themes";
import Link from "@docusaurus/Link";

import "./styles.scss";
import { trackButtonClick } from "@site/src/lib/analytics";

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

	const onClick = useCallback(() => {
		trackButtonClick("button_reference_card", "v1", {
			href,
		});
	}, [href]);

	if (hasAvatarInChildren) {
		return (
			<Box p="4" asChild>
				<Card className="reference-card" asChild>
					<Link to={href} onClick={onClick}>
						<Flex gap="3" align="center">
							{children}
						</Flex>
					</Link>
				</Card>
			</Box>
		);
	}

	return (
		<Box p="5" asChild>
			<Card className="reference-card">
				<Link to={href} onClick={onClick}>
					<Flex gap="3" direction="column">
						{children}
					</Flex>
				</Link>
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
		<Text className="reference-card__title" size="4" weight="bold">
			{children}
		</Text>
	);
}

function ReferenceCardDescription({ children }: React.PropsWithChildren<{}>) {
	return (
		<Text className="reference-card__description" size="2" color="gray">
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
