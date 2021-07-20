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

export function FrontendRoutingTabs(props) {
    return (
        <Tabs
            groupId="frontendrouting"
            defaultValue="with-react-router-dom"
            values={[
                { label: 'With react-router-dom', value: 'with-react-router-dom' },
                { label: 'With custom routing', value: 'with-custom-routing' },
            ]}>
            {props.children}
        </Tabs>
    );
}