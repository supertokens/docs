import {
  Flex,
  Select,
  Box,
  Heading,
  SegmentedControl,
  Code,
  Card,
  Button,
  Text,
  Separator,
  ScrollArea,
} from "@radix-ui/themes";
import CodeBlock from "@theme/CodeBlock";

import Link from "@docusaurus/Link";
import useBrokenLinks from "@docusaurus/useBrokenLinks";
import { useThemeConfig } from "@docusaurus/theme-common";
import { AppTypeSelect } from "/src/components/Select";
import { createContext, useContext, useMemo, useState } from "react";
import { SideModal } from "../Modal";

import InfoIcon from "/img/icons/info.svg";
import { OpenAPIDocument } from "@site/src/lib/types";

import "./HTTPRequestCard.scss";

type HTTPRequestContextType = {
  environment: "shell" | "nodejs" | "python" | "go";
  path: string;
  method: "post" | "get" | "put" | "delete" | "patch" | "head" | "options";
  title: string;
  isDetailsModalOpen: boolean;
};

const HTTPRequestCardContext = createContext<HTTPRequestContextType>({} as HTTPRequestContextType);

function HTTPRequestCardRoot({
  path,
  method,
  title,
  children,
}: {
  path: string;
  method: HTTPRequestContextType["method"];
  title: string;
  children: React.ReactNode;
}) {
  const [selectedEnvironment, setSelectedEnvironment] = useState<HTTPRequestContextType["environment"]>("shell");
  const [showRequestDetails, setShowRequestDetails] = useState(false);

  const titleId = useMemo(() => {
    return `${title.replace(/\s/g, "-").toLowerCase()}-http-request`;
  }, [title]);
  const brokenLinks = useBrokenLinks();
  brokenLinks.collectAnchor(titleId);

  // if (!Requests.paths[path] || !Requests.paths[path][method]) {
  // 	throw new Error(
  // 		`Could not find request for path ${path} and method ${method}`,
  // 	);
  // }
  //
  return (
    <HTTPRequestCardContext.Provider
      value={{
        environment: selectedEnvironment,
        path,
        method,
        title,
        isDetailsModalOpen: showRequestDetails,
      }}
    >
      <SideModal.Root open={showRequestDetails} onOpenChange={setShowRequestDetails}>
        <Box p="0" asChild>
          <Card mb="4" className="http-request-card">
            <Flex direction="row" pt="4" pb="3" px="4" justify="between">
              <Flex direction="column" gap="2">
                <Heading as="h3" mb="xs" size="6" style={{ scrollMarginTop: "200px" }}>
                  {title}
                  {/* Use a custom anchor point so that the browser scroll snaps to the correct position */}
                  <a className="http-request-card__heading-anchor" id={titleId} />
                </Heading>
                <Box px="1" asChild>
                  <Code weight="bold" variant="ghost" color="gray" size="2">
                    {method.toUpperCase()} {path}
                  </Code>
                </Box>
              </Flex>

              <SideModal.Trigger>
                <Button variant="solid" color="gray" highContrast>
                  <InfoIcon /> View Details
                </Button>
              </SideModal.Trigger>
            </Flex>
            <Flex px="4" direction="column" gap="4">
              <SegmentedControl.Root
                defaultValue="shell"
                value={selectedEnvironment}
                onValueChange={(value) =>
                  setSelectedEnvironment(value as unknown as HTTPRequestContextType["environment"])
                }
              >
                <SegmentedControl.Item value="shell">Shell</SegmentedControl.Item>
                <SegmentedControl.Item value="nodejs">NodeJS</SegmentedControl.Item>
                <SegmentedControl.Item value="python">Python</SegmentedControl.Item>
                <SegmentedControl.Item value="go">Go</SegmentedControl.Item>
              </SegmentedControl.Root>
              {children}
              {/* <ShellExample /> */}
              {/* <NodeJSExample /> */}
              {/* <PythonExample /> */}
              {/* <GoExample /> */}
            </Flex>
          </Card>
        </Box>
      </SideModal.Root>
    </HTTPRequestCardContext.Provider>
  );
}

function ShellExample({ children }: { children: React.ReactNode }) {
  const { environment } = useContext(HTTPRequestCardContext);

  if (environment !== "shell") return null;

  return (
    <>
      <Flex direction="row" justify="between" align="center">
        <Text color="gray" size="3" weight="bold">
          Curl Example
        </Text>
        <AppTypeSelect />
      </Flex>
      {/* <CodeBlock language="bash"> */}
      {children}
      {/* </CodeBlock> */}
    </>
  );
}

function NodeJSExample({ children }: { children: React.ReactNode }) {
  const { environment } = useContext(HTTPRequestCardContext);

  if (environment !== "nodejs") return null;

  return (
    <>
      <Flex direction="row" justify="between" align="center">
        <Text color="gray" size="3" weight="bold">
          Fetch Example
        </Text>
        <AppTypeSelect />
      </Flex>
      {/* <CodeBlock language="tsx"> */}
      {children}
      {/* </CodeBlock> */}
    </>
  );
}

function PythonExample({ children }: { children: React.ReactNode }) {
  const { environment } = useContext(HTTPRequestCardContext);

  if (environment !== "python") return null;

  return (
    <>
      <Flex direction="row" justify="between" align="center">
        <Text color="gray" size="3" weight="bold">
          Requests Example
        </Text>
        <AppTypeSelect />
      </Flex>
      <CodeBlock language="bash">{children}</CodeBlock>
    </>
  );
}

function GoExample({ children }: { children: React.ReactNode }) {
  const { environment } = useContext(HTTPRequestCardContext);

  if (environment !== "go") return null;

  return (
    <>
      <Flex direction="row" justify="between" align="center">
        <Text color="gray" size="3" weight="bold">
          HTTP Example
        </Text>
        <AppTypeSelect />
      </Flex>
      {/* <CodeBlock language="bash"> */}
      {children}
      {/* </CodeBlock> */}
    </>
  );
}

function DetailsModal({ children }) {
  return (
    <ScrollArea type="auto" style={{ height: "100%" }}>
      <SideModal.Content style={{ paddingTop: "0", paddingBottom: "0" }} className="http-request-card-details-modal">
        {children}
        <Flex
          direction="row"
          align="center"
          justify="end"
          pb="6"
          pt="3"
          style={{
            position: "sticky",
            zIndex: 10,
            bottom: 0,
            background: "var(--color-panel-solid)",
          }}
        >
          <SideModal.Close>
            <Button variant="solid" color="gray" highContrast size="2">
              Close
            </Button>
          </SideModal.Close>
        </Flex>
      </SideModal.Content>
    </ScrollArea>
  );
}

function DetailsModalHeader({ children }: { children: React.ReactNode }) {
  const { title, method, path } = useContext(HTTPRequestCardContext);

  return (
    <Flex
      direction="column"
      pt="6"
      gap="1"
      style={{
        position: "sticky",
        top: 0,
        background: "var(--color-panel-solid)",
        zIndex: 10,
      }}
    >
      <Heading as="h1" color="orange" asChild>
        <SideModal.Title>{title}</SideModal.Title>
      </Heading>
      <Flex px="1" style={{ alignSelf: "flex-start" }} mb="3" asChild>
        <Code weight="bold" variant="ghost" color="gray" size="3">
          {method.toUpperCase()} {path}
        </Code>
      </Flex>

      {children}

      <Separator size="4" mt="3" />
    </Flex>
  );
}

function DetailsModalBody({ children }: { children: React.ReactNode }) {
  return (
    <Flex direction="column" gap="2" flexGrow="1">
      {children}
    </Flex>
  );
}

function RequestDescriptionText({ children }: { children: React.ReactNode }) {
  return (
    <Text className="http-request-card-details-modal__description-text" color="gray" size="3">
      {children}
    </Text>
  );
}

export const HTTPRequestCard = Object.assign(HTTPRequestCardRoot, {
  ShellExample,
  NodeJSExample,
  PythonExample,
  GoExample,
  DetailsModal,
  DetailsModalDescription: RequestDescriptionText,
  DetailsModalBody: DetailsModalBody,
  DetailsModalHeader: DetailsModalHeader,
});
