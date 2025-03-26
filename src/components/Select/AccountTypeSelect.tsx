import { Select } from "@radix-ui/themes";

import { useDocPageData } from "@site/src/hooks";
import { docPageStore } from "@site/src/lib";

export function AccountTypeSelect() {
  const accountType = useDocPageData("accountType");
  return (
    <Select.Root
      value={accountType}
      onValueChange={(value) => docPageStore.updateValue("accountType", value as "managed" | "self-hosted")}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="managed">Managed Service</Select.Item>
        <Select.Item value="self-hosted">Self-hosted</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
