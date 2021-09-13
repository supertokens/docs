import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;

export default function GoFrameworkSubTabs(props) {
    return (
        <Tabs
            isSubTab={true}
            groupId="go-framework"
            defaultValue="http"
            values={[
                { label: 'Chi', value: 'chi' },
                { label: 'net/http', value: 'http' },
                { label: 'Gin', value: 'gin' },
                { label: 'Mux', value: 'mux' },
            ]}>
            {props.children}
        </Tabs>
    );
}