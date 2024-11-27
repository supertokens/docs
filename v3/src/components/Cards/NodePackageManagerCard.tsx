import { Flex, Card, Separator, Select } from "@radix-ui/themes";
import { useCallback, useContext } from "react";
import { DocItemContext } from "../DocItemContext";

import "./styles.scss";

function NodePackageManagerCardRoot({ children }: React.PropsWithChildren<{}>) {
  const { backend, onChangeBackendSettings } = useContext(DocItemContext);

  const packageManager = (backend.settings.packageManager || "npm7+") as string;
  const onChange = useCallback(
    (value: string) => {
      onChangeBackendSettings({
        ...backend.settings,
        packageManager: value,
      });
    },
    [backend],
  );

  return (
    <Card className="content-card" mb="4">
      <Flex gap="2" direction="row" pt="3" pb="3" px="3">
        <Select.Root value={packageManager} onValueChange={onChange}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="npm7+">{`NPM>=7`}</Select.Item>
            <Select.Item value="npm6">{`NPM6`}</Select.Item>
            <Select.Item value="yarn">Yarn</Select.Item>
          </Select.Content>
        </Select.Root>
      </Flex>
      <Separator size="4" />
      {children}
    </Card>
  );
}

function NodePackageManagerCardContent({
  value,
  children,
}: React.PropsWithChildren<{ value: string }>) {
  const { backend } = useContext(DocItemContext);

  const packageManager = backend.settings.packageManager;
  if (packageManager !== value) return null;

  return children;
}

export const NodePackageManagerCard = Object.assign(
  NodePackageManagerCardRoot,
  {
    Content: NodePackageManagerCardContent,
  },
);
