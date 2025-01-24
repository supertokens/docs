import { Select } from "@radix-ui/themes";

import { useDocPageData } from "@site/src/hooks";
import { docPageStore } from "@site/src/lib";

export function NextjsRouterTypeSelect() {
  const nextjsRouterType = useDocPageData("nextjsRouterType");
  return (
    <Select.Root
      value={nextjsRouterType}
      onValueChange={(value) => docPageStore.updateValue("nextjsRouterType", value as "app-router" | "pages-router")}
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="app-router">App Router</Select.Item>
        <Select.Item value="pages-router">Pages Router</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
