import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NodeJSFrameworkSubTabs(props) {
    return (
        <Tabs
            isSubTab={true}
            groupId="nodejs-framework"
            defaultValue="express"
            values={[
                { label: 'Express', value: 'express' },
                { label: 'Hapi', value: 'hapi' },
                { label: 'Fastify', value: 'fastify' },
                { label: 'Koa', value: 'koa' },
                { label: 'Loopback', value: 'loopback' },
                { label: 'AWS Lambda', value: 'awsLambda' },
            ]}>
            {props.children}
        </Tabs>
    );
}