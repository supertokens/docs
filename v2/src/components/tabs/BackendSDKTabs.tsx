import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function BackendSDKTabs(props: any) {
    const values = [];

    if (!props.disableNodeJS) {
        values.push({ label: 'NodeJS', value: 'nodejs' });
    }
    if (!props.disableGolang) {
        values.push({ label: 'GoLang', value: 'go' });
    }
    if (!props.disablePython) {
        values.push({ label: 'Python', value: 'python' });
    }

    return (
        <Tabs
            isSubTab={props.isSubTab}
            groupId="backendsdk"
            defaultValue={props.defaultValue ? props.defaultValue : values[0].value}
            values={values}>
            {props.children}
        </Tabs>
    );
}