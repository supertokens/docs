import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NextjsAppTabs(props) {
    return (
        <Tabs
            groupId="nextjs-app"
            defaultValue="app-js"
            values={[
                { label: '/pages/_app.js', value: 'app-js' },
                { label: '/pages/_app.ts', value: 'app-ts' },
            ]}>
            {props.children}
        </Tabs>
    );
}