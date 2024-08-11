import * as React from "react";
import { getSelection, FrontendChoice, BackendChoice } from "./utils";

const FrontendOptions = [
  "react",
  "angular",
  "vue",
  "vanillajs",
  "nextjs",
  "react-native",
  "ios",
  "android",
  "flutter",
];

const BackendOptions = [
  "nodejs",
  "nextjs",
  "golang",
  "python",
  "php",
  "c#",
  "java",
];

const BackendFrameworkOptions = [];

const AuthMethods = [];

const WithCustomUI = [];

export default function BackendView(props: {
  children: React.ReactNode;
  backend: BackendChoice;
}) {
  let selection = getSelection();

  return <div>{JSON.stringify(selection)}</div>;
}

