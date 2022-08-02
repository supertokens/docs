import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function BackendSDKTabs(props: any) {
    return (
        <Tabs
            isSubTab={props.isSubTab}
            groupId="backendsdk"
            defaultValue="nodejs"
            values={[
                { label: 'NodeJS', value: 'nodejs' },
                { label: 'GoLang', value: 'go' },
                { label: 'Python', value: 'python' },
            ]}>
            {props.children}
        </Tabs>
    );
}