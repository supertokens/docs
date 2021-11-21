import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function RRDVersionSubTabs(props) {
    return (
        <Tabs
            isSubTab={true}
            groupId="rrd-version"
            defaultValue="v6"
            values={[
                { label: '>= Version 6', value: 'v6' },
                { label: '<= Version 5', value: 'v5' }
            ]}>
            {props.children}
        </Tabs>
    );
}