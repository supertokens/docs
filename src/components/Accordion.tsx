import React, { Children, createContext } from "react";
import * as RadixAccordion from "@radix-ui/react-accordion";
import ChevronDownIcon from "/img/icons/chevron-down.svg";

import { Card, Box, Flex, Heading } from "@radix-ui/themes";

import "./Accordion.scss";

type AccordionContextType = {
  mode: "jsx" | "mdx";
  px: string;
};

const AccordionContext = createContext<AccordionContextType>({} as AccordionContextType);

function AccordionRoot({
  children,
  mode = "jsx",
  px = "0",
}: React.PropsWithChildren<{ mode?: "jsx" | "mdx"; px?: string }>) {
  const childrenArray = Children.toArray(children);

  if (mode === "jsx") {
    return (
      <AccordionContext.Provider value={{ mode, px }}>
        <Card asChild>
          <Flex p="0" direction="column" gap="0" align="stretch" asChild>
            <RadixAccordion.Root className="accordion" type="multiple">
              {children}
            </RadixAccordion.Root>
          </Flex>
        </Card>
      </AccordionContext.Provider>
    );
  }

  const items: { title: React.ReactNode; content: React.ReactNode }[] = [];
  let currentItem: { title: React.ReactNode; content: React.ReactNode } = null;

  for (const child of childrenArray) {
    // @ts-expect-error The array should always include elements as children
    if (child.type.name === "h2") {
      if (currentItem) {
        items.push(currentItem);
      }
      // @ts-expect-error
      currentItem = { title: child.props.children, content: [] };
    } else {
      // @ts-expect-error
      currentItem.content.push(child);
    }
  }
  items.push(currentItem);

  return (
    <AccordionContext.Provider value={{ mode, px }}>
      <Card asChild>
        <Flex p="0" direction="column" gap="0" align="stretch" data-exclude-headings-from-toc="true" asChild>
          <RadixAccordion.Root className="accordion" type="multiple">
            {items.map(({ title, content }, index) => (
              <AccordionItem value={`${title.toString()}-${index}`} key={index}>
                <AccordionItemHeader>{title}</AccordionItemHeader>
                <AccordionItemContent>{content}</AccordionItemContent>
              </AccordionItem>
            ))}
          </RadixAccordion.Root>
        </Flex>
      </Card>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, value }: React.PropsWithChildren<{ value: string }>) {
  return (
    <RadixAccordion.Item className="accordion__item" value={value}>
      {children}
    </RadixAccordion.Item>
  );
}

function AccordionItemHeader({ children }: React.PropsWithChildren) {
  const { mode } = React.useContext(AccordionContext);
  return (
    <Flex asChild>
      <RadixAccordion.Header className="accordion__header">
        <Flex justify="between" align="center" px="4" asChild flexGrow="1">
          <Heading asChild size="3" as="h4">
            <Box py="4" asChild>
              <RadixAccordion.Trigger className="accordion__trigger">
                {mode === "mdx" ? <div>{children}</div> : children}
                <ChevronDownIcon className="accordion__icon" style={{ width: "20px", height: "20px" }} aria-hidden />
              </RadixAccordion.Trigger>
            </Box>
          </Heading>
        </Flex>
      </RadixAccordion.Header>
    </Flex>
  );
}

function AccordionItemContent({ children }: React.PropsWithChildren) {
  const { px } = React.useContext(AccordionContext);

  return (
    <RadixAccordion.Content className="accordion__content">
      <Flex direction="column" gap="3" px={px} asChild>
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
