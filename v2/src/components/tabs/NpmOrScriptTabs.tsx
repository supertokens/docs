import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;

export default function NpmOrScriptTabs(props: any) {
    return (
        <Tabs
            isSubTab={true}
            groupId="npm-or-script"
            defaultValue="npm"
            values={[
                { label: 'Via NPM', value: 'npm' },
                { label: 'Via Script Tag', value: 'script' },
            ]}>
            {props.children}
        </Tabs>
    );
}