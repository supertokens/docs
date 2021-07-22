import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function STConfigTabs(props) {
    return (
        <Tabs
            groupId="st-config"
            defaultValue="config-ts"
            values={[
                { label: '/config/supertokensConfig.js', value: 'config-js' },
                { label: '/config/supertokensConfig.ts', value: 'config-ts' },
            ]}>
            {props.children}
        </Tabs>
    );
}