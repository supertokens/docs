import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NextjsAPITabs(props) {
    return (
        <Tabs
            groupId="nextjs-api"
            defaultValue="api-js"
            values={[
                { label: 'pages/api/auth/[[...path]].js', value: 'api-js' },
                { label: 'pages/api/auth/[[...path]].ts', value: 'api-ts' },
            ]}>
            {props.children}
        </Tabs>
    );
}