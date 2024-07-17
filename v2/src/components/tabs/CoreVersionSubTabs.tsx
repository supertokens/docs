import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function CoreVersionSubTabs(props: any) {
    return (
        <Tabs
            isSubTab={true}
            groupId="core-versions"
            defaultValue="core-9.1"
            values={[
                { label: 'Core version >= 9.1.0', value: 'core-9.1' },
                { label: 'Core version <= 9.0.2', value: 'core-9.0' }
            ]}>
            {props.children}
        </Tabs>
    );
}