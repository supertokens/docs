import { Box, Flex, Grid, Heading, Separator } from "@radix-ui/themes";
import { APIRequestMethod } from "@site/src/types";
import ReactDOM from "react-dom";
import {
  APIRequestApiTypeBadge,
  APIRequestBody,
  APIRequestContext,
  APIRequestDeprecatedCallout,
  APIRequestDescription,
  APIRequestHeaderParameters,
  APIRequestPath,
  APIRequestPathParameters,
  APIRequestProvider,
  APIRequestQueryParameters,
  APIRequestResponse,
  APIRequestSecuritySection,
  APIRequestTitle,
} from "./APIRequest";
import { APIRequestResponsePreview } from "./APIRequestResponsePreview";
import { APIRequestApiTypeCallout } from "./ApiRequestApiTypeCallout";
import { APIRequestCodeSnippetSegmentedControl } from "./APIRequestCodeSnippet";
import { useContext, useRef } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";

export function APIRequestPage({
  method,
  path,
  title,
  apiName,
}: {
  path: string;
  method: APIRequestMethod;
  title: string;
  apiName: "fdi" | "cdi";
}) {
  return (
    <APIRequestProvider apiName={apiName} path={path} method={method} title={title}>
      <BrowserOnly>{() => <APIReferencePageTitle />}</BrowserOnly>
      <Flex direction="column" flexGrow="1" gap="2">
        <APIRequestDeprecatedCallout />
        <APIRequestDescription />
        <APIRequestSecuritySection />
        <Separator size="4" mb="4" mt="2" />
        <Heading as="h2" size="8">
          Request
        </Heading>
        <APIRequestPathParameters />
        <APIRequestQueryParameters />
        <APIRequestHeaderParameters />
        <APIRequestBody />
        <Separator size="4" mt="6" mb="4" />
        <Heading as="h2" size="8">
          Response
        </Heading>
        <APIRequestResponse />
      </Flex>
      <Flex direction="column" gap="2" width={{ initial: "100%", md: "40%" }}>
        <Box style={{ position: "sticky", top: "140px" }}>
          <APIRequestCodeSnippetSegmentedControl />
          <APIRequestResponsePreview />
        </Box>
      </Flex>
    </APIRequestProvider>
  );
}

function APIReferencePageTitle() {
  // Access a value from the context to force a re-render
  const { operation } = useContext(APIRequestContext);
  const root = document.getElementById(API_REFERENCE_PAGE_TITLE_ID);

  if (!root) return null;

  return ReactDOM.createPortal(
    <Flex mb="4">
      <APIRequestPath />
      <Box ml="auto">
        <APIRequestApiTypeBadge />
      </Box>
    </Flex>,
    root,
  );
}

export const API_REFERENCE_PAGE_TITLE_ID = "api-reference-page-title";
