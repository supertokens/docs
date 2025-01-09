import { Select } from "@radix-ui/themes";
import { useCallback, useContext } from "react";

import { DocItemContext } from "@site/src/context";

const SelectOptions = [
  { value: "MAGIC_LINK", label: "Magic Link" },
  { value: "USER_INPUT_CODE", label: "OTP" },
  { value: "USER_INPUT_CODE_AND_MAGIC_LINK", label: "Magic Link and OTP" },
];

export const PasswordlessFlowTypeSelect = () => {
  const { recipes, onChangeRecipeProperty } = useContext(DocItemContext);

  const flowType = recipes.passwordless.flowType;
  const onChange = useCallback(
    (value) => {
      onChangeRecipeProperty("passwordless", "flowType", value);
    },
    [onChangeRecipeProperty],
  );

  const valueLabel = SelectOptions.find((option) => option.value === flowType)?.label;

  return (
    <Select.Root value={flowType} onValueChange={onChange}>
      <Select.Trigger>Flow Type: {valueLabel}</Select.Trigger>
      <Select.Content>
        {SelectOptions.map((option) => (
          <Select.Item key={option.value} value={option.value}>
            {option.label}
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
};
