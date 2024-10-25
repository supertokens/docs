import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function OAuthBackendTabs(props: any) {
  return (
    <Tabs
      groupId="oauth-backend-tabs"
      isSubTab={false}
      defaultValue="nodejs"
      values={[
        { label: "NodeJS", value: "nodejs" },
        { label: "GoLang", value: "go" },
        { label: "Python", value: "python" },
        { label: "Java", value: "java" },
        { label: "PHP", value: "php" },
        { label: "C#", value: "c#" },
      ]}
    >
      {props.children}
    </Tabs>
  );
}
