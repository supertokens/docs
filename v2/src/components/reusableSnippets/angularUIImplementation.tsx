import React, { PropsWithChildren } from "react";
import {Question, Answer} from "../question"

export default function AngularUIImplementation(props: PropsWithChildren<{
  prebuiltUI?: any,
  customUI?: any
}>) {
  return (
    <Question
      question="What type of UI are you using?"
    >
    {props.children}
    </Question>
  );
}
