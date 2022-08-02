import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function WithWithoutSDK(props: any) {
    return (
        <Tabs
            groupId="withwithoutsdk"
            defaultValue="withsdk"
            values={[
                { label: 'Using SuperTokens SDK', value: 'withsdk' },
                { label: 'Without SDK', value: 'withoutsdk' }
            ]}>
            {props.children}
        </Tabs>
    );
}