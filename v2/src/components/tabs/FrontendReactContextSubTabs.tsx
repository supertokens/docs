import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function FrontendReactContextSubTabs(props: any) {
    return (
        <Tabs
            isSubTab={true}
            groupId="frontendreactcontext"
            defaultValue="with-react-context"
            values={[
                { label: 'With React Context', value: 'with-react-context' },
                { label: 'Without React Context', value: 'without-react-context' },
            ]}>
            {props.children}
        </Tabs>
    );
}