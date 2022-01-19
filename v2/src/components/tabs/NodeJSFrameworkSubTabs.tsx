import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NodeJSFrameworkSubTabs(props: any) {
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
                { label: 'AWS Lambda / Netlify', value: 'awsLambda' },
                { label: 'Next.js', value: 'nextjs' },
                { label: 'NestJS', value: 'nestjs' },
            ]}>
            {props.children}
        </Tabs>
    );
}