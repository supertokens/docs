import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;

export default function PythonSyncAsyncSubTabs(props: any) {
    return (
        <Tabs
            isSubTab={true}
            groupId="python-framework"
            defaultValue="asyncio"
            values={[
                { label: 'Asyncio', value: 'asyncio' },
                { label: 'Syncio', value: 'syncio' }
            ]}>
            {props.children}
        </Tabs>
    );
}