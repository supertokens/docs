import React, { PropsWithChildren } from "react";
import {Question} from "../question"

export default function VueUIImplementation(props: PropsWithChildren<{}>) {
  return (
    <Question
      question="What type of UI are you using?"
      persistentId="vue-ui"
    >
    {props.children}
    </Question>
  );
}
