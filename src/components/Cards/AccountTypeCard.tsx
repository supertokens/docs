import { Flex, Box, Card, Separator } from "@radix-ui/themes";

import { AccountTypeSelect, SelfHostedDeploymentTypeSelect } from "../Select";
import { useDocPageData } from "@site/src/hooks";

function AccountTypeCardRoot({ children }: React.PropsWithChildren<{}>) {
  const accountType = useDocPageData("accountType");
  return (
    <Card className="content-card" mb="4">
      <Flex direction="row" pt="3" pb="3" px="3" justify="between">
        <AccountTypeSelect />
        {accountType === "self-hosted" ? <SelfHostedDeploymentTypeSelect /> : null}
      </Flex>
      <Separator size="4" />
      {children}
    </Card>
  );
}

function AccountTypeCardSection({
  children,
  px = "2",
  py = "4",
}: React.PropsWithChildren<{
  px?: React.ComponentProps<typeof Box>["px"];
  py?: React.ComponentProps<typeof Box>["py"];
}>) {
  return (
    <Flex direction="column" gap="3" px={px} py={py} className="content-card__section">
      {children}
    </Flex>
  );
}

function AccountTypeManagedContent({ children }: React.PropsWithChildren<{}>) {
  const accountType = useDocPageData("accountType");
  if (accountType === "self-hosted") return null;
  return <AccountTypeCardSection>{children}</AccountTypeCardSection>;
}

function AccountTypeSelfHostedContent({
  children,
  value,
}: React.PropsWithChildren<{ value: "with-docker" | "without-docker" }>) {
  const accountType = useDocPageData("accountType");
  const selfHostedDeploymentType = useDocPageData("selfHostedDeploymentType");
  if (accountType !== "self-hosted") return null;
  if (selfHostedDeploymentType !== value) return null;
  return children;
}

export const AccountTypeCard = Object.assign(AccountTypeCardRoot, {
  ManagedContent: AccountTypeManagedContent,
  SelfHostedContent: AccountTypeSelfHostedContent,
  Section: AccountTypeCardSection,
});
