import { Select } from "@radix-ui/themes";

import { useSelectionStore } from "@site/src/hooks";
import { useMemo } from "react";

const ThirdPartyBuiltinProvidersSelectionName = "thirdparty-builtin-providers";
const ThirdPartyBuiltinProvidersDefaultValue = "chi";

const ThirdPartyBuiltinProviderOptions = [
  { label: "Google", value: "google" },
  { label: "Google Workspace", value: "google-workspace" },
  { label: "Apple", value: "apple" },
  { label: "Discord", value: "discord" },
  { label: "Facebook", value: "facebook" },
  { label: "GitHub", value: "github" },
  { label: "Linkedin", value: "linkedin" },
  { label: "Twitter", value: "twitter" },
  { label: "Active Directory", value: "active-directory" },
  { label: "OKTA", value: "okta" },
  { label: "Bitbucket", value: "bitbucket" },
  { label: "GitLab", value: "gitlab" },
  { label: "SAML Login", value: "saml" },
];

export function useThirdPartyBuiltinProvidersSelection() {
  return useSelectionStore(ThirdPartyBuiltinProvidersSelectionName, ThirdPartyBuiltinProvidersDefaultValue);
}

export function ThirdPartyBuiltinProvidersSelect({ exclude }: { exclude?: string[] }) {
  const [value, setValue] = useThirdPartyBuiltinProvidersSelection();
  const selectOptions = useMemo(() => {
    if (exclude) return ThirdPartyBuiltinProviderOptions.filter((tabItem) => !exclude.includes(tabItem.value));
    return ThirdPartyBuiltinProviderOptions;
  }, [exclude]);

  return (
    <Select.Root value={value} onValueChange={setValue}>
      <Select.Trigger />
      <Select.Content>
        {selectOptions.map((option) => (
          <Select.Item key={`${ThirdPartyBuiltinProvidersSelectionName}-${option.value}`} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}
