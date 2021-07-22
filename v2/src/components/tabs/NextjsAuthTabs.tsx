import React from "react";
let Tabs = require("@theme/Tabs").default;

export default function NextjsAuthTabs(props) {
    return (
        <Tabs
            groupId="nextjs-auth"
            defaultValue="auth-js"
            values={[
                { label: 'pages/auth/[[...path]].js', value: 'auth-js' },
                { label: 'pages/auth/[[...path]].tsx', value: 'auth-tsx' },
            ]}>
            {props.children}
        </Tabs>
    );
}