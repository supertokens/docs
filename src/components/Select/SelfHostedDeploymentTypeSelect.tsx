import { Select } from "@radix-ui/themes";

import { useDocPageData } from "@site/src/hooks";
import { docPageStore } from "@site/src/lib";

export function SelfHostedDeploymentTypeSelect() {
  const selfHostedDeploymentType = useDocPageData("selfHostedDeploymentType");
  return (
    <Select.Root
      value={selfHostedDeploymentType}
      onValueChange={(value) =>
        docPageStore.updateValue("selfHostedDeploymentType", value as "with-docker" | "without-docker")
      }
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="with-docker">With Docker</Select.Item>
        <Select.Item value="without-docker">Without Docker</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
