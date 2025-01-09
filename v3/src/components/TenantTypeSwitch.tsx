import React, { useContext } from "react";
import { DocItemContext } from "@site/src/context";
import { Card, Flex, Heading, RadioCards, Text } from "@radix-ui/themes";

function TenantTypeSwitch({}) {
  const { tenantType, onChangeTenantType } = useContext(DocItemContext);

  return (
    <Flex gap="2" direction="column" mb="6" py="5" px="4" asChild>
      <Card>
        <Heading as="h3" size="5">
          Are you using a multi-tenant setup?
        </Heading>
        <Flex direction="row" gap="2" align="start">
          <RadioCards.Root defaultValue={tenantType === "multi" ? "yes" : "no"} columns={{ initial: "1", sm: "2" }}>
            <RadioCards.Item value="yes" onClick={() => onChangeTenantType("multi")}>
              <Flex direction="column" width="100%" height="100%" align="start">
                <Text weight="bold">Yes</Text>
              </Flex>
            </RadioCards.Item>
            <RadioCards.Item value="no" onClick={() => onChangeTenantType("single")}>
              <Flex direction="column" width="100%" height="100%" align="start">
                <Text weight="bold">No</Text>
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
