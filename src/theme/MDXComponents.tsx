import MDXComponents from "@theme-original/MDXComponents";
import {
  OSTabs,
  DocItemContextValue,
  UIType,
  ContextCondition,
  OAuthFrontendVerificationCallout,
  NextjsRouterTypeSelect,
  DescriptionText,
  ConditionalContent,
  ReferenceCard,
  PaidFeatureCallout,
  TokensCallout,
  Steps,
  Accordion,
  APIRequestPage,
  RemoveForLLMs,
  PythonSyncAsyncCard,
  FrontendPrebuiltUITabs,
  FrontendCustomUITabs,
  BackendTabs,
  AppInfoForm,
  SelfHostingTabs,
  NpmOrScriptsCard,
  MobileFrameworksCard,
  Question,
  Answer,
  TenantType,
  SDKCompatibilityTable,
  NodePackageManagerCard,
  NodeFrameworksCard,
  PythonFrameworksCard,
  GoFrameworksCard,
  JavascriptHttpLibraryCard,
  ThirdPartyBuiltinProvidersCard,
  CodeSampleCard,
  PasswordlessConfigCard,
  HTTPRequestCard,
  AccountTypeCard,
  NpmOrScriptsSelect,
  NodePackageManagerSelect,
  MobileFrameworksSelect,
  NodeFrameworksSelect,
  GoFrameworksSelect,
  PythonFrameworksSelect,
  JavascriptHttpLibrarySelect,
  PythonSyncAsyncSelect,
  ThirdPartyBuiltinProvidersSelect,
  AppTypeSelect,
  PasswordlessFlowTypeSelect,
  PasswordlessContactMethodSelect,
  AccountTypeSelect,
  SelfHostedDeploymentTypeSelect,
  TenantTypeSelect,
  FrontendTabs,
  ReactRouterVersionTabs,
  DatabaseTabs,
  PasswordlessRecipeForm,
  ExampleAppForm,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  OAuthVerifyTokensCallout,
  ReactRouterCallout,
} from "@site/src/components";
import { Separator as RadixSeparator, Table, Flex, Box, Heading, Badge } from "@radix-ui/themes";

import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";

function HR() {
  return <RadixSeparator size="4" mt="5" mb="3" />;
}

const TableRoot = ({ children }) => {
  return (
    <Table.Root mb="4" variant="surface">
      {children}
    </Table.Root>
  );
};

const h1 = ({ children, ...props }) => {
  return (
    <Heading as="h1" size="8" mb="4" {...props}>
      {children}
    </Heading>
  );
};

const h2 = ({ children, ...props }) => {
  return (
    <Heading as="h2" size="7" mb="4" {...props}>
      {children}
    </Heading>
  );
};

const h3 = ({ children, ...props }) => {
  return (
    <Heading as="h3" size="6" mb="4" {...props}>
      {children}
    </Heading>
  );
};

const h4 = ({ children, ...props }) => {
  return (
    <Heading as="h4" size="5" mb="4" {...props}>
      {children}
    </Heading>
  );
};

export default {
  ...MDXComponents,
  h1,
  h2,
  h3,
  h4,
  table: TableRoot,
  thead: Table.Header,
  tbody: Table.Body,
  UIType,
  NextjsRouterTypeSelect,
  ConditionalContent,
  OSTabs,
  th: Table.ColumnHeaderCell,
  td: Table.Cell,
  tr: Table.Row,
  hr: HR,
  DescriptionText: DescriptionText,
  DocItemContextValue,
  Tabs,
  TabItem,
  PaidFeatureCallout,
  TokensCallout,
  APIRequestPage,
  RemoveForLLMs,
  Steps: ({ children, ...rest }) => (
    <Steps mode="mdx" {...rest}>
      {children}
    </Steps>
  ),
  Accordion: ({ children, ...rest }) => (
    <Accordion mode="mdx" {...rest}>
      {children}
    </Accordion>
  ),
  ReferenceCard,
  PythonSyncAsyncCard,
  FrontendPrebuiltUITabs,
  FrontendCustomUITabs,
  BackendTabs,
  AppInfoForm,
  SelfHostingTabs,
  NpmOrScriptsCard,
  MobileFrameworksCard,
  Question,
  Answer,
  TenantType,
  SDKCompatibilityTable,
  NodePackageManagerCard,
  NodeFrameworksCard,
  PythonFrameworksCard,
  GoFrameworksCard,
  JavascriptHttpLibraryCard,
  ThirdPartyBuiltinProvidersCard,
  CodeSampleCard,
  PasswordlessConfigCard,
  HTTPRequestCard,
  AccountTypeCard,
  NpmOrScriptsSelect,
  NodePackageManagerSelect,
  MobileFrameworksSelect,
  NodeFrameworksSelect,
  GoFrameworksSelect,
  PythonFrameworksSelect,
  JavascriptHttpLibrarySelect,
  PythonSyncAsyncSelect,
  AppTypeSelect,
  PasswordlessFlowTypeSelect,
  PasswordlessContactMethodSelect,
  AccountTypeSelect,
  TenantTypeSelect,
  FrontendTabs,
  DatabaseTabs,
  PasswordlessRecipeForm,
  ExampleAppForm,
  ThirdPartyBuiltinProvidersSelect,
  ReactRouterVersionTabs,
  SelfHostedDeploymentTypeSelect,
  ContextCondition,
  OAuthFrontendVerificationCallout,
  OAuthVerifyTokensCallout,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,

  // Plain Radix componets
  Flex,
  Separator: RadixSeparator,
  Box,

  Badge,
};
