import { Flex, Badge, Text, Heading, Separator, Box } from "@radix-ui/themes";
import { Children, cloneElement, createContext, isValidElement, useContext } from "react";
import { ParagraphStripper } from "./StripParagraph";

const StepContext = createContext({} as { position: number; isLast: boolean });

function Step({
  isLast = false,
  position = 1,
  children,
}: React.PropsWithChildren<{ isLast?: boolean; position?: number }>) {
  return (
    <StepContext.Provider value={{ position, isLast }}>
      <Flex position="relative" direction="column" minHeight="50px">
        {children}
        <StepSeparator />
      </Flex>
    </StepContext.Provider>
  );
}

function StepHeader({ children }: React.PropsWithChildren<{}>) {
  return (
    <Flex direction="row" align="center">
      <StepBadge />
      <Heading as="h3" size="3" ml="4" mb="0">
        <ParagraphStripper>{children}</ParagraphStripper>
      </Heading>
    </Flex>
  );
}

function StepDescription({ children }: React.PropsWithChildren<{}>) {
  return (
    <Text ml="8" mt="1">
      {children}
    </Text>
  );
}

function StepBadge() {
  const { position } = useContext(StepContext);

  return (
    <Flex width="30px" height="30px" display="flex" justify="center" align="center" asChild>
      <Badge radius="full" size="3" variant="solid" highContrast color="gray">
        <Text weight="bold">{position}</Text>
      </Badge>
    </Flex>
  );
}

function StepSeparator() {
  const { isLast } = useContext(StepContext);
  if (isLast) return null;

  return (
    <Box position="absolute" left="15px" asChild>
      <Separator orientation="vertical" size="4" my="5" />
    </Box>
  );
}

function StepsRoot({ children }: React.PropsWithChildren<{}>) {
  const childrenArray = Children.toArray(children);

  return (
    <Flex direction="column" gap="2">
      {childrenArray.map((child, index) => {
        if (!isValidElement(child)) return child;
        return cloneElement(child, {
          // @ts-expect-error
          isLast: index === childrenArray.length - 1,
          position: index + 1,
          key: child.key || index,
        });
      })}
    </Flex>
  );
}

export const Steps = Object.assign(StepsRoot, {
  Step,
  StepHeader,
  StepDescription,
  StepBadge,
  StepSeparator,
});
