import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";

export default function NodeJSFrameworkSubTabsServerless(props) {
    return (
        <Tabs
            isSubTab={true}
            groupId="nodejs-framework-serverless"
            defaultValue="express"
            values={[
                { label: 'Express', value: 'express' },
                { label: 'Hapi', value: 'hapi' },
                { label: 'Fastify', value: 'fastify' },
                { label: 'Koa', value: 'koa' },
                { label: 'Loopback', value: 'loopback' },
                { label: 'Serverless', value: 'serverless' },
                { label: 'Next.js', value: 'nextjs' },
            ]}>
            {childContainsTabItemWithValue("serverless", props.children) ? null : DefaultServerlessTabItem()}
            {childContainsTabItemWithValue("nextjs", props.children) ? null : DefaultNextjsTabItem()}
            {props.children}
        </Tabs>
    );
}

function DefaultServerlessTabItem() {
    return (
        <TabItem value="serverless">
            <div className="admonition admonition-info alert alert--info">
                <div className="admonition-heading">
                    <h5>
                        <span className="admonition-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
                                <path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path>
                            </svg>
                        </span>
                        info
                    </h5>
                </div>
                <div className="admonition-content">
                    <p>Please refer the <strong>Serverless Deployment</strong> section (Towards the bottom of the navigation index)</p>
                </div>
            </div>
        </TabItem>
    );
}

function DefaultNextjsTabItem() {
    return (
        <TabItem value="nextjs">
            <div className="admonition admonition-info alert alert--info">
                <div className="admonition-heading">
                    <h5>
                        <span className="admonition-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
                                <path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"></path>
                            </svg>
                        </span>
                        info
                    </h5>
                </div>
                <div className="admonition-content">
                    <p>Please refer the <strong>NextJS</strong> section (Towards the bottom of the navigation index)</p>
                </div>
            </div>
        </TabItem>
    );
}