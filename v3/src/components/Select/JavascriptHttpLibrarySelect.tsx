import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "@site/src/hooks";

const JavascriptHttpLibrarySelectionName = "javascript-http-library";
const JavascriptHttpLibraryDefaultValue = "fetch";

export function useJavascriptHttpLibrarySelection() {
  return useSelectionStore(JavascriptHttpLibrarySelectionName, JavascriptHttpLibraryDefaultValue);
}

export function JavascriptHttpLibrarySelect() {
  const [value, setValue] = useJavascriptHttpLibrarySelection();

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger />
      <Select.Content>
        <Select.Item value="fetch">fetch</Select.Item>
        <Select.Item value="axios">axios</Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
