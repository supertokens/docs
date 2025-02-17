import { Callout, Separator, Heading, Text, Button, Flex, Box } from "@radix-ui/themes";

import Link from "@docusaurus/Link";
import InfoCircleIcon from "/img/icons/info-circled.svg";

import { SideModal } from "../Modal";

export function TokensCallout(): JSX.Element {
  return (
    <SideModal.Root defaultOpen={false}>
      <Flex align="center" asChild>
        <Callout.Root color="orange" variant="surface" size="2" className="admonition" style={{ display: "flex" }}>
          <Callout.Icon>
            <InfoCircleIcon />
          </Callout.Icon>
          <Flex flexGrow="1" gap="2" align="center" direction="row">
            <Box mb="0" asChild>
              <Callout.Text>
                This guide only applies to scenarios which involve <b>SuperTokens Session Access Tokens</b>.
              </Callout.Text>
            </Box>

            <SideModal.Trigger>
              <Button ml="auto" size="1">
                View Details
              </Button>
            </SideModal.Trigger>

            <SideModal.Content className="http-request-card-details-modal" size="s">
              <Flex direction="column" flexGrow="1">
                <Heading as="h1" size="8" mt="2">
                  Token Types
                </Heading>
                <Separator size="4" mb="5" />

                <Text mt="2">
                  <b>SuperTokens</b> uses a special set of tokens for most of the authentication flows. Only the{" "}
                  <Link href="/docs/authentication/unified-login/introduction">
                    <b>Unified Login</b>
                  </Link>{" "}
                  and{" "}
                  <Link href="/docs/authentication/m2m/introduction">
                    <b>M2M</b>
                  </Link>{" "}
                  features work with standard OAuth2 tokens.{" "}
                </Text>
                <Text mt="2">Read more on each token type in the next section.</Text>

                <Separator size="3" mt="6" mb="4" />
                <Heading as="h2" size="6" mb="5">
                  SuperTokens Tokens
                </Heading>
                <Text mt="2">
                  The standard tokens implemented in <b>SuperTokens</b>. They are used in the authentication methods
                  that do not follow <b>OAuth2</b> flows.
                </Text>

                <Separator size="3" mt="6" mb="4" />
                <Heading as="h2" size="6">
                  OAuth2 Tokens
                </Heading>
                <Text mt="2">
                  These tokens adhere to the OAuth2 specifications. They are used in the <b>Client Credentials</b> (M2M)
                  and in the <b>Authorization Code</b> (Unified Login) flows to authenticate clients and access
                  protected resources.
                </Text>
              </Flex>

              <Flex direction="row" align="center" justify="end">
                <SideModal.Close>
                  <Button variant="solid" color="gray" highContrast size="2">
                    Close
                  </Button>
                </SideModal.Close>
              </Flex>
            </SideModal.Content>
          </Flex>
        </Callout.Root>
      </Flex>
    </SideModal.Root>
  );
}
