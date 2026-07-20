import { Callout, Separator, Heading, Text, Button, Flex, Box } from "@radix-ui/themes";

import Link from "@docusaurus/Link";
import CreditCardIcon from "/img/icons/credit-card.svg";
import InfoCircleIcon from "/img/icons/info-circled.svg";

import { SideModal } from "./Modal";
import { Steps } from "./Steps";

export function PaidFeatureCallout(): JSX.Element {
  return (
    <SideModal.Root defaultOpen={false}>
      <Flex align="center" asChild>
        <Callout.Root color="orange" variant="surface" size="2" className="admonition" style={{ display: "flex" }}>
          <Callout.Icon>
            <CreditCardIcon />
          </Callout.Icon>
          <Flex flexGrow="1" gap="2" align="center" direction="row">
            <Box mb="0" asChild>
              <Callout.Text>This feature is only available to paid users.</Callout.Text>
            </Box>

            <SideModal.Trigger>
              <Button ml="auto" size="1">
                View Details
              </Button>
            </SideModal.Trigger>

            <SideModal.Content className="http-request-card-details-modal" size="s">
              <Flex direction="column" flexGrow="1">
                <Heading as="h1" size="8" mt="2">
                  Enable paid features
                </Heading>
                <Separator size="4" mb="5" />

                <Text mt="2">
                  This feature is only available to paid users. Enable it using the provided instructions.
                </Text>
                <Callout.Root color="blue" variant="surface" size="2" mt="4">
                  <Callout.Icon>
                    <InfoCircleIcon />
                  </Callout.Icon>
                  <Box mb="0" asChild>
                    <Callout.Text>
                      You can test the feature in a development environment for free. We only start charging once you
                      use it production.
                    </Callout.Text>
                  </Box>
                </Callout.Root>

                <Heading as="h2" size="6" mb="5" mt="6">
                  Managed Service
                </Heading>
                <Steps>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Login into the{" "}
                        <Link href="https://supertokens.com/dashboard" target="_blank">
                          SaaS dashboard
                        </Link>
                        .
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Select the <em>Managed</em> tab and open the deployment that you are working with.
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        After the page loads click on the <em>Features</em> tab.
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Open <em>Features</em> and toggle the features you want to enable. Changes are saved
                        automatically.
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                </Steps>

                <Heading as="h2" size="6" mt="8">
                  Self Hosted
                </Heading>
                <Steps>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Login into the{" "}
                        <Link href="https://supertokens.com/dashboard" target="_blank">
                          SaaS dashboard
                        </Link>
                        .
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Select the <em>Self-hosted</em> tab and create a new license key.
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Open the license key and toggle the features you want to use. Changes are saved automatically.
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                  <Steps.Step>
                    <Steps.StepHeader>
                      <Text>
                        Add the newly created license key to{" "}
                        <Link href="/docs/deployment/self-host-supertokens#5-add-license-keys">your Core Service</Link>.
                      </Text>
                    </Steps.StepHeader>
                  </Steps.Step>
                </Steps>
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
