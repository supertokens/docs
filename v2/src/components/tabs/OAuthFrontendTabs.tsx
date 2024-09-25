import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function OAuthFrontendTabs(props: any) {
  return (
    <Tabs
      groupId="oauth-backend-tabs"
      isSubTab={false}
      defaultValue="react"
      values={[
        { label: "React", value: "react" },
        { label: "Angular", value: "angular" },
        { label: "Vue", value: "vue" },
      ]}
    >
      {props.children}
    </Tabs>
  );
}
