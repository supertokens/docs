import { Callout, Separator, Heading, Text, Button, Flex, Box } from "@radix-ui/themes";

import Link from "@docusaurus/Link";
import InfoCircleIcon from "/img/icons/info-circled.svg";

import { SideModal } from "../Modal";
import { Steps } from "../Steps";

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

                <Heading as="h2" size="6" mb="5" mt="6">
                  SuperTokens Tokens
                </Heading>
                <Text mt="2" asChild>
                  <ul>
                    <li>Used in</li>
                    <li>Provides</li>
                    <li>Holds</li>
                    <li>asda</li>
                  </ul>
                </Text>

                <Heading as="h2" size="6" mt="8">
                  OAuth2 Tokens
                </Heading>
                <Text mt="2">
                  <ul>
                    <li>Used in</li>
                    <li>Provides</li>
                    <li>Holds</li>
                    <li>asda</li>
                  </ul>
                </Text>
              </Flex>

              <Flex direction="row" align="center" justify="end" pb="3" pt="3">
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
