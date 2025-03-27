import { Select } from "@radix-ui/themes";

import { useDocPageData } from "@site/src/hooks";
import { docPageStore } from "@site/src/lib";

export function TenantTypeSelect() {
  const tenantType = useDocPageData("tenantType");
  return (
    <Select.Root
      value={tenantType}
      onValueChange={(value) => docPageStore.updateValue("tenantType", value as "single-tenant" | "multi-tenant")}
    >
      <Select.Trigger variant="ghost" color="gray" mr="xs" />
      <Select.Content>
        <Select.Item value="single-tenant">Single Tenant</Select.Item>
        <Select.Item value="multi-tenant">Multi Tenant</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
