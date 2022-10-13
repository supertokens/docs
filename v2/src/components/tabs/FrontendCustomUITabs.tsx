import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { applyCopyTabs } from "./FrontendPreBuiltUITabs"

export default function FrontendCustomUITabs(props: any) {
  // this is done twice since vue has a copy tabs pointing at angular and angular also has copy tabs
  return (<Tabs
    groupId="frontendcustomui"
    defaultValue="web"
    values={[
      { label: "Web", value: "web" },
      { label: "Mobile", value: "mobile" }
    ]}
  >
    {props.children}
  </Tabs>)
}