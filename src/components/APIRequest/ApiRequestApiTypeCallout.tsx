import { Callout, Text, Flex, Heading } from "@radix-ui/themes";
import { useContext } from "react";
import { APIRequestContext } from "./APIRequest";

import InfoCircledIcon from "/img/icons/info-circled.svg";

export function APIRequestApiTypeCallout() {
  const { apiName } = useContext(APIRequestContext);

  if (apiName === "cdi") {
    return (
      <Callout.Root color="blue">
        <Flex gap="2">
          <Callout.Icon>
            <InfoCircledIcon width="20px" height="20px" />
          </Callout.Icon>
          <Flex direction="column">
            <Heading as="h3" size="4" mb="2">
              CDI Endpoint
            </Heading>
            <Text>
              The endpoint is part of the <b>Core Driver Interface</b> API. It's exposed by the SuperTokens Core service
              and you should only use it from your backend applications.
            </Text>
          </Flex>
        </Flex>
      </Callout.Root>
    );
  }

  return (
    <Callout.Root color="blue">
      <Flex gap="2">
        <Callout.Icon>
          <InfoCircledIcon width="20px" height="20px" />
        </Callout.Icon>
        <Flex direction="column">
          <Heading as="h3" size="4" mb="2">
            FDI Endpoint
          </Heading>
          <Text>
            This endpoint is part of the <b>Frontend Driver Interface</b> API. It's exposed by the SuperTokens Backend
            SDKs and you should only use it from your frontend applications.
          </Text>
        </Flex>
      </Flex>
    </Callout.Root>
  );
}
