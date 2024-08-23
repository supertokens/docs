import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";


export default function BackendSDKTabs(props: any) {
    const values = [];

    if (props.enableDashboard) {
        values.push({ label: 'Dashboard', value: 'dashboard' })
    }

    if (!props.disableNodeJS) {
        values.push({ label: 'NodeJS', value: 'nodejs' });
    }
    if (!props.disableGolang) {
        values.push({ label: 'GoLang', value: 'go' });
    }
    if (!props.disablePython) {
        values.push({ label: 'Python', value: 'python' });
    }
    if (props.enableJava) {
        values.push({ label: 'Java', value: 'java' });
    }
    if (props.enableCurl) {
        values.push({ label: 'cURL', value: 'curl' });
    }
    if (!props.disableOtherFrameworks && !props.enableCurl) {
        values.push({ label: 'Other Frameworks', value: 'otherFrameworks' });
    }

    return (
        <Tabs
            isSubTab={props.isSubTab}
            groupId="backendsdk"
            defaultValue={props.defaultValue ? props.defaultValue : values[0].value}
            values={values}>
            {childContainsTabItemWithValue("otherFrameworks", props.children)
                ? null
                : DefaultOtherFrameworks()}
            {props.children}
        </Tabs>
    );
}


function DefaultOtherFrameworks() {
    return (
        <TabItem value="otherFrameworks" mdxType="TabItem">
            <div className="admonition admonition-caution alert alert--warning">
                <div className="admonition-heading">
                    <h5>
                        <span className="admonition-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z">
                                </path>
                            </svg>
                        </span>
                        Important
                    </h5>
                </div>
                <div className="admonition-content">
                    For other backend frameworks, you can follow our <a href="/docs/community/other-frameworks">guide on how to spin up a separate server configured with the SuperTokens backend SDK </a> to authenticate requests and issue session tokens.
                </div>
            </div>
        </TabItem>
    );
}
