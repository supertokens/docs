import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function BackendSDKTabs(props) {
    return (
        <Tabs
            groupId="backendsdk"
            defaultValue="nodejs"
            values={[
                { label: 'NodeJS', value: 'nodejs' },
            ]}>
            {props.children}
        </Tabs>
    );
}