import React, { PropsWithChildren } from "react";
import {Question} from "../question"

export default function PreBuiltOrCustomUI(props: PropsWithChildren<{}>) {
  return (
    <Question
      question="How are you planning to use SuperTokens on the frontend?"
      persistentId="prebuilt-custom-ui"
    >
    {props.children}
    </Question>
  );
}
