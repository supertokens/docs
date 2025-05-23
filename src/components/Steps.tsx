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
      <Text size="4" ml="4" mb="0">
        <ParagraphStripper>{children}</ParagraphStripper>
      </Text>
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
      <Badge
        radius="full"
        size="3"
        variant="outline"
        color="gray"
        style={{ background: "var(--color-background)", zIndex: 5 }}
      >
        <Text weight="bold">{position}</Text>
      </Badge>
    </Flex>
  );
}

function StepSeparator() {
  const { isLast } = useContext(StepContext);
  if (isLast) return null;

  return (
    <Box position="absolute" left="15px" top="30px" asChild>
      <Separator orientation="vertical" size="4" />
    </Box>
  );
}

// The component works in two modes
// 1. jsx - you define the content explicitly
// by using the Step components <Step.Header />, <Step.Description />,
//
// 2. mdx - the component parses mdx content
// and transforms it into <Step /> components
// <Steps>
//  ## Step Name
//  Content
//  ## Step Name
//  Content
// </Steps>
function StepsRoot({ children, mode = "jsx" }: React.PropsWithChildren<{ mode?: "jsx" | "mdx" }>) {
  const childrenArray = Children.toArray(children);

  if (mode === "jsx") {
    return (
      <Flex direction="column" gap="2" data-exclude-headings-from-toc="true">
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

  const steps: { title: React.ReactNode; description: React.ReactNode }[] = [];
  let currentStep: { title: React.ReactNode; description: React.ReactNode } = null;

  for (const child of childrenArray) {
    // @ts-expect-error The array should always include elements as children
    if (["h2", "h3", "h4", "h5", "h6"].includes(child.type.name)) {
      if (currentStep) {
        steps.push(currentStep);
      }
      // @ts-expect-error
      currentStep = { title: child.props.children, description: [] };
    } else {
      // @ts-expect-error
      currentStep.description.push(child);
    }
  }
  steps.push(currentStep);

  return (
    <Flex direction="column" gap="2" data-exclude-headings-from-toc="true">
      {steps.map(({ title, description }, index) => (
        <Step key={index} isLast={index === steps.length - 1} position={index + 1}>
          <StepHeader>{title}</StepHeader>
          <StepDescription>{description}</StepDescription>
        </Step>
      ))}
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
