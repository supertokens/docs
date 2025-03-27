import React, { useContext } from "react";
import { DocItemContext } from "@site/src/context";
import { Card, Flex, Heading, RadioCards, Text } from "@radix-ui/themes";
import { useIsVisible } from "../hooks";

function TenantTypeSwitch({}) {
  const { tenantType, onChangeTenantType } = useContext(DocItemContext);
  const { visibilityRef, isVisible } = useIsVisible();

  return (
    <Flex ref={visibilityRef} gap="2" direction="column" mb="6" py="5" px="4" width="fit-content" asChild>
      <Card>
        <Heading as="h3" size="4">
          What is your setup type?
        </Heading>
        <Flex direction="row" gap="2" align="start">
          <RadioCards.Root value={tenantType} columns={{ initial: "1", sm: "2" }}>
            <RadioCards.Item value="single" className="radio-card-item" onClick={() => onChangeTenantType("single")}>
              <Flex direction="column" width="100%" height="100%" align="start">
                <Text weight="bold">Single Tenant</Text>
                <Text>One common user pool for your entire application</Text>
              </Flex>
            </RadioCards.Item>
            <RadioCards.Item value="multi" className="radio-card-item" onClick={() => onChangeTenantType("multi")}>
              <Flex direction="column" width="100%" height="100%" align="start">
                <Text weight="bold">Multi Tenant</Text>
                <Text>Different users pools grouped by tenant</Text>
              </Flex>
            </RadioCards.Item>
          </RadioCards.Root>
        </Flex>
      </Card>
    </Flex>
  );
}

function HeadingFilter({ children, name }: React.PropsWithChildren<{ name: string }>) {
  return <div data-heading-filter={name}>{children}</div>;
}

function SingleTenantContent({ children }: React.PropsWithChildren<{}>) {
  const state = useContext(DocItemContext);

  return <HeadingFilter name="single">{state.tenantType === "single" ? children : null}</HeadingFilter>;
}

function MultiTenantContent({ children }: React.PropsWithChildren<{}>) {
  const state = useContext(DocItemContext);

  return <HeadingFilter name="multi">{state.tenantType === "multi" ? children : null}</HeadingFilter>;
}

export const TenantType = {
  Switch: TenantTypeSwitch,
  SingleTenantContent,
  MultiTenantContent,
};
