import React, { useCallback, useContext } from "react";
import { DocsItemContext } from "../DocsItemContext/DocsItemContext";

import Form from "./Form";
import RadioGroup from "./RadioGroup";

export default function ReactRouterSection() {
  const { frontend, onChangeFrontendSettings } = useContext(DocsItemContext);

  const onChangeAnswer = useCallback(
    (value) => {
      const newSettings = {
        ...frontend.settings,
        usesReactRouter: value === "Yes",
      };
      onChangeFrontendSettings(newSettings);
    },
    [frontend],
  );

  const onChangeReactRouterVersion = useCallback(
    (value) => {
      const newSettings = { ...frontend.settings, reactRouterVersion: value };
      onChangeFrontendSettings(newSettings);
    },
    [frontend],
  );

  const usesReactRouter = frontend.settings.usesReactRouter as boolean;
  const reactRouterVersion = frontend.settings.reactRouterVersion as string;

  return (
    <>
      <Form.Section>
        <Form.SectionTitle>Do you use react-router-dom?</Form.SectionTitle>
        <Form.Grid>
          <RadioGroup
            value={usesReactRouter ? "Yes" : "No"}
            onChange={onChangeAnswer}
          >
            <RadioGroup.Item value="Yes">Yes</RadioGroup.Item>
            <RadioGroup.Item value="No">No</RadioGroup.Item>
          </RadioGroup>
        </Form.Grid>
        {usesReactRouter && (
          <>
            <Form.Field>
              <Form.Label>Which Version?</Form.Label>
              <RadioGroup
                value={reactRouterVersion}
                onChange={onChangeReactRouterVersion}
              >
                <RadioGroup.Item value=">=v6">{`react-router-dom >= v6`}</RadioGroup.Item>
                <RadioGroup.Item value="<=v5">{`react-router-dom <= v5`}</RadioGroup.Item>
              </RadioGroup>
            </Form.Field>
          </>
        )}
      </Form.Section>
    </>
  );
}
