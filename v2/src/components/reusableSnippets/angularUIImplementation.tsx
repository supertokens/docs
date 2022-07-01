import React, { PropsWithChildren } from "react";
import {Question} from "../question"

export default function AngularUIImplementation(props: PropsWithChildren<{}>) {
  return (
    <Question
      question="What type of UI are you using?"
      persistentId="angular-ui"
    >
    {props.children}
    </Question>
  );
}
