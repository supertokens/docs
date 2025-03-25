import { Box, Flex, Grid, Heading, Separator } from "@radix-ui/themes";
import { APIRequestMethod } from "@site/src/types";
import {
  APIRequestBody,
  APIRequestDescription,
  APIRequestHeaderParameters,
  APIRequestPath,
  APIRequestPathParameters,
  APIRequestProvider,
  APIRequestQueryParameters,
  APIRequestResponse,
  APIRequestTitle,
} from "./APIRequest";
import { APIRequestResponsePreview } from "./APIRequestResponsePreview";
import { APIRequestCodeSnippetSegmentedControl } from "./APIRequestCodeSnippet";

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
      <Flex direction="column" flexGrow="1" gap="2">
        <APIRequestDescription />
        {/* <APIRequestAPINameCallout /> */}
        <Separator size="4" mb="4" mt="2" />
        <Heading as="h2" size="8">
          Request
        </Heading>
        <APIRequestPath />
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
