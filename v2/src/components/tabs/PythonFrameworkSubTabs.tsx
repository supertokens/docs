import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;

export default function PythonFrameworkSubTabs(props) {
    return (
        <Tabs
            isSubTab={true}
            groupId="python-framework"
            defaultValue="fastapi"
            values={[
                { label: 'FastAPI', value: 'fastapi' },
                // { label: 'Flask', value: 'flask' },
                // { label: 'Django', value: 'django' }
            ]}>
            {props.children}
        </Tabs>
    );
}