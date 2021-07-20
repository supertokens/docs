import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NodeJSFrameworkSubTabs(props) {
    return (
        <Tabs
            isSubTab={true}
            groupId="nodejs-framework"
            defaultValue="express"
            values={[
                { label: 'ExpressJS', value: 'express' },
                { label: 'HapiJS', value: 'hapi' },
            ]}>
            {props.children}
        </Tabs>
    );
}