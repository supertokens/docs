import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NpmVersionOrYarnSubTabs(props: any) {
    return (
        <Tabs
            isSubTab={true}
            groupId="npm-or-yarn"
            defaultValue="npm7+"
            values={[
                { label: 'Via NPM>=7', value: 'npm7+' },
                { label: 'Via NPM6', value: 'npm6' },
                { label: 'Via Yarn', value: 'yarn' },
            ]}>
            {props.children}
        </Tabs>
    );
}