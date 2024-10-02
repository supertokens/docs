import React, { useContext } from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";
import VueUIImplementation from "../reusableSnippets/vueUIImplementation";
import { recursiveMapAllChildren } from "../utils";
import { DocsItemContext } from "../DocsItemContext/DocsItemContext";

const copyTabIdentifier = "~COPY-TABS=";

export default function FrontendPreBuiltUITabs(props: any) {
  const { onChangeFrontendFramework } = useContext(DocsItemContext);
  let values = [
    { label: "ReactJS", value: "reactjs" },
    { label: "Angular", value: "angular" },
    { label: "Vue", value: "vue" },
  ];

  if (props.showMobileTab !== undefined) {
    values.push({
      label: "Mobile",
      value: "mobile",
    });
  }

  // this is done twice since vue has a copy tabs pointing at angular and angular also has copy tabs
  return applyCopyTabs(
    applyCopyTabs(
      <Tabs
        groupId="frontendsdk"
        defaultValue="reactjs"
        values={values}
        onClick={onChangeFrontendFramework}
      >
        {childContainsTabItemWithValue("reactjs", props.children)
          ? null
          : DefaultReactJSTabItem()}
        {childContainsTabItemWithValue("angular", props.children)
          ? null
          : DefaultAngularTabItem()}
        {childContainsTabItemWithValue("vue", props.children)
          ? null
          : DefaultVueTabItem()}
        {props.children}
      </Tabs>,
    ),
  );
}

export function applyCopyTabs(children: any): any {
  return recursiveMapAllChildren(children, (child: any) => {
    if (
      !React.isValidElement(child.props.children) &&
      typeof child.props.children === "string" &&
      child.props.children.startsWith(copyTabIdentifier)
    ) {
      let tabToCopyIdentifiers = child.props.children
        .split(copyTabIdentifier)[1]
        .trim()
        .split(",");
      for (let i = 0; i < tabToCopyIdentifiers.length; i++) {
        let result = undefined;
        recursiveMapAllChildren(children, (child: any) => {
          if (
            child.props &&
            child.props.mdxType === "TabItem" &&
            child.props.value === tabToCopyIdentifiers[i]
          ) {
            result = child.props.children;
          }
          return child;
        });
        if (result !== undefined) {
          return result;
        }
      }
    }
    return child;
  });
}

function DefaultReactJSTabItem() {
  return (
    <>Should never show this since we support ReactJS SDK for everything...</>
  );
}

function DefaultAngularTabItem() {
  throw new Error(
    "Should never come here cause we add angular tab item all the time",
  );
}

function DefaultVueTabItem() {
  return (
    <TabItem value="vue" mdxType="TabItem">
      <VueUIImplementation>~COPY-TABS=angular</VueUIImplementation>
    </TabItem>
  );
}
