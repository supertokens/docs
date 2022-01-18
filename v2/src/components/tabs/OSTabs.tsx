import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function OSTabs(props: any) {
    return (
        <Tabs
            groupId="os"
            defaultValue="linux"
            values={[
                { label: 'Linux', value: 'linux' },
                { label: 'Mac', value: 'mac' },
                { label: 'Windows', value: 'windows' },
            ]}>
            {props.children}
        </Tabs>
    );
}