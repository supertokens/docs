import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function FrontendReactRoutingSubTabs(props) {
    return (
        <Tabs
            isSubTab={true}
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