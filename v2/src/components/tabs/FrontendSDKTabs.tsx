import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";

export default function FrontendSDKTabs(props) {
    return (
        <Tabs
            groupId="frontendsdk"
            defaultValue="reactjs"
            values={[
                { label: 'ReactJS', value: 'reactjs' },
                { label: 'Plain JavaScript', value: 'vanillajs' },
            ]}>
            {childContainsTabItemWithValue("reactjs", props.children) ? null : DefaultReactJSTabItem()}
            {childContainsTabItemWithValue("vanillajs", props.children) ? null : DefaultVanillaJSTabItem()}
            {props.children}
        </Tabs>
    );
}

function DefaultReactJSTabItem() {
    return <>Should never show this since we support ReactJS SDK for everything...</>;
}

function DefaultVanillaJSTabItem() {
    return (
        <TabItem value="vanillajs">
            <div className="admonition admonition-caution alert alert--warning">
                <div className="admonition-heading">
                    <h5>
                        <span className="admonition-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z">
                                </path>
                            </svg>
                        </span>
                        not supported
                    </h5>
                </div>
                <div className="admonition-content">
                    <ul>
                        <li>We support only the <a href="/docs/session/introduction">session recipe</a> for VanillaJS.</li>
                        <li>You can use the session recipe and build the login UI yourself by directly integrating with <a href="/docs/thirdpartyemailpassword/apis">our APIs</a></li>
                    </ul>
                </div>
            </div>
        </TabItem>
    );
}
