import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function FrontendSDKTabs(props) {
    return (
        <Tabs
            groupId="frontendsdk"
            defaultValue="reactjs"
            values={[
                { label: 'ReactJS', value: 'reactjs' },
                { label: 'Vanilla JS', value: 'vanillajs' },
            ]}>
            {props.children}
        </Tabs>
    );
}