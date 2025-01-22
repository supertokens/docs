import React from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import ChevronDownIcon from "/img/icons/chevron-down.svg";

import { Card, Box, Flex, Heading } from "@radix-ui/themes";

import "./Accordion.scss";

function AccordionRoot({
	children,
}: React.PropsWithChildren<{ collapsible: boolean }>) {
	return (
		<Card asChild>
			<Flex p="0" direction="column" gap="0" align="stretch" asChild>
				<RadixAccordion.Root className="accordion" type="multiple">
					{children}
				</RadixAccordion.Root>
			</Flex>
		</Card>
	);
}

function AccordionItem({
	children,
	value,
}: React.PropsWithChildren<{ value: string }>) {
	return (
		<RadixAccordion.Item className="accordion__item" value={value}>
			{children}
		</RadixAccordion.Item>
	);
}

function AccordionItemHeader({ children }: React.PropsWithChildren) {
	return (
		<Flex asChild>
			<RadixAccordion.Header className="accordion__header">
				<Flex justify="between" align="center" px="4" asChild flexGrow="1">
					<Heading asChild size="3" as="h4">
						<Box py="4" asChild>
							<RadixAccordion.Trigger className="accordion__trigger">
								{children}
								<ChevronDownIcon
									className="accordion__icon"
									style={{ width: "20px", height: "20px" }}
									aria-hidden
								/>
							</RadixAccordion.Trigger>
						</Box>
					</Heading>
				</Flex>
			</RadixAccordion.Header>
		</Flex>
	);
}

function AccordionItemContent({ children }: React.PropsWithChildren) {
	return (
		<RadixAccordion.Content className="accordion__content">
			<Flex direction="column" gap="3" pt="2" px="4" asChild>
				<div className="accordion__content-text">{children}</div>
			</Flex>
		</RadixAccordion.Content>
	);
}

export const Accordion = Object.assign(AccordionRoot, {
	Item: AccordionItem,
	ItemHeader: AccordionItemHeader,
	ItemContent: AccordionItemContent,
});
