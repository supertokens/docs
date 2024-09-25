import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function OAuthMobileTabs(props: any) {
  return (
    <Tabs
      groupId="oauth-backend-tabs"
      isSubTab={false}
      defaultValue="react-native"
      values={[
        { label: "React Native", value: "react-native" },
        { label: "Swift", value: "swift" },
        { label: "Kotlin", value: "kotlin" },
      ]}
    >
      {props.children}
    </Tabs>
  );
}
