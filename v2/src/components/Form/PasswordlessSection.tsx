import React, { useCallback, useContext } from "react";
import { DocsItemContext } from "../DocsItemContext/DocsItemContext";

import Form from "./Form";
import RadioGroup from "./RadioGroup";

export default function PasswordlessSettingsSection({
  showFlowType = true,
}: {
  showFlowType?: boolean;
}) {
  const { authenticationRecipes, onChangeRecipeSettings } =
    useContext(DocsItemContext);

  const onChangeContactMethod = useCallback(
    (value) => {
      onChangeRecipeSettings("passwordless", "contactMethod", value);
    },
    [authenticationRecipes],
  );

  const onChangeFlowType = useCallback(
    (value) => {
      onChangeRecipeSettings("passwordless", "flowType", value);
    },
    [authenticationRecipes],
  );

  if (!authenticationRecipes.passwordless.enabled) return null;

  return (
    <>
      <Form.Separator />
      <Form.Section>
        <Form.SectionTitle>Passwordless Config</Form.SectionTitle>
        {showFlowType ? (
          <Form.Grid>
            <Form.Field>
              <Form.Label>Contact Method</Form.Label>
              <RadioGroup
                value={
                  authenticationRecipes.passwordless.settings.contactMethod
                }
                onChange={onChangeContactMethod}
              >
                <RadioGroup.Item value="EMAIL">Email</RadioGroup.Item>
                <RadioGroup.Item value="PHONE">Phone Number</RadioGroup.Item>
                <RadioGroup.Item value="EMAIL_OR_PHONE">
                  Email or Phone Number
                </RadioGroup.Item>
              </RadioGroup>
            </Form.Field>
            <Form.Field>
              <Form.Label>Flow Type</Form.Label>
              <RadioGroup
                value={authenticationRecipes.passwordless.settings.flowType}
                onChange={onChangeFlowType}
              >
                <RadioGroup.Item value="MAGIC_LINK">Magic Link</RadioGroup.Item>
                <RadioGroup.Item value="USER_INPUT_CODE">OTP</RadioGroup.Item>
                <RadioGroup.Item value="USER_INPUT_CODE_AND_MAGIC_LINK">
                  OTP and Magic Link
                </RadioGroup.Item>
              </RadioGroup>
            </Form.Field>
          </Form.Grid>
        ) : (
          <Form.Field>
            <Form.Label>Contact Method</Form.Label>
            <RadioGroup
              value={authenticationRecipes.passwordless.settings.contactMethod}
              onChange={onChangeContactMethod}
            >
              <RadioGroup.Item value="EMAIL">Email</RadioGroup.Item>
              <RadioGroup.Item value="PHONE">Phone Number</RadioGroup.Item>
              <RadioGroup.Item value="EMAIL_OR_PHONE">
                Email or Phone Number
              </RadioGroup.Item>
            </RadioGroup>
          </Form.Field>
        )}
      </Form.Section>
    </>
  );
}
