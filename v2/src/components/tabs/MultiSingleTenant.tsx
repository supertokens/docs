import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function MultiSingleTenant(props: any) {
    return (
        <Tabs
            groupId="multi-tenant-or-single-tenant"
            defaultValue="single"
            values={[
                { label: 'Single Tenant', value: 'single' },
                { label: 'Multi Tenant', value: 'multi' }
            ]}>
            {props.children}
        </Tabs>
    );
}