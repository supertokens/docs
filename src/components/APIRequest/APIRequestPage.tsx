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
  APIRequestSkeleton,
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
      <APIRequestSkeleton>
        <BrowserOnly>{() => <APIReferencePageTitle title={title} />}</BrowserOnly>
        <Flex direction="column" flexGrow="1" gap="2">
          <APIRequestDeprecatedCallout />
          <APIRequestDescription />
          <APIRequestSecuritySection />
          <APIRequestPathParameters />
          <APIRequestQueryParameters />
          <APIRequestHeaderParameters />
          <APIRequestBody />
          <APIRequestResponse />
        </Flex>
        <Flex direction="column" gap="2" width={{ initial: "100%", md: "40%" }}>
          <Flex style={{ position: "sticky", top: "140px" }} gap="5" direction="column">
            <APIRequestCodeSnippetSegmentedControl />
            <APIRequestResponsePreview />
          </Flex>
        </Flex>
      </APIRequestSkeleton>
    </APIRequestProvider>
  );
}

function APIReferencePageTitle({ title }: { title: string }) {
  // Access a value from the context to force a re-render
  const { operation } = useContext(APIRequestContext);
  const root = document.getElementById(API_REFERENCE_PAGE_TITLE_ID);

  if (!root) return null;

  return ReactDOM.createPortal(
    <Box mb="4">
      <Heading
        as="h1"
        size={{
          initial: "7",
          md: "8",
        }}
      >
        {title}
      </Heading>
      <Flex align="center">
        <APIRequestPath />
        <Box ml="auto" display={{ initial: "none", md: "block" }}>
          <APIRequestApiTypeBadge />
        </Box>
      </Flex>{" "}
    </Box>,
    root,
  );
}

export const API_REFERENCE_PAGE_TITLE_ID = "api-reference-page-title";
