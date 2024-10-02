import React, { useMemo, useCallback, useContext } from "react";
import { DocsItemContext } from "../DocsItemContext/DocsItemContext";

import Form from "./Form";
import CheckboxGroup from "./CheckboxGroup";

export default function AuthenticationRecipesSection() {
  const { authenticationRecipes, onToggleAuthenticationRecipe } =
    useContext(DocsItemContext);

  const selectedAuthenticationRecipes = useMemo(() => {
    const selectedAuthenticationRecipes: string[] = [];
    for (const recipeName in authenticationRecipes) {
      // @ts-expect-error
      if (authenticationRecipes[recipeName].enabled) {
        selectedAuthenticationRecipes.push(recipeName);
      }
    }
    return selectedAuthenticationRecipes;
  }, [authenticationRecipes]);

  return (
    <>
      <Form.SectionTitle>Authentication Methods</Form.SectionTitle>
      <CheckboxGroup
        value={selectedAuthenticationRecipes}
        onChange={onToggleAuthenticationRecipe}
      >
        <CheckboxGroup.Item value="emailpassword">
          Email and Password
        </CheckboxGroup.Item>

        <CheckboxGroup.Item value="passwordless">
          Passwordless
        </CheckboxGroup.Item>

        <CheckboxGroup.Item value="thirdparty">
          Social/Enterprise Login
        </CheckboxGroup.Item>
      </CheckboxGroup>
    </>
  );
}
