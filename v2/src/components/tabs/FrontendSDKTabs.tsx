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
                { label: 'React Native', value: 'react-native' },
            ]}>
            {childContainsTabItemWithValue("reactjs", props.children) ? null : DefaultReactJSTabItem()}
            {childContainsTabItemWithValue("vanillajs", props.children) ? null : DefaultVanillaJSTabItem()}
            {childContainsTabItemWithValue("react-native", props.children) ? null : DefaultRNTabItem()}
            {props.children}
        </Tabs>
    );
}

function DefaultReactJSTabItem() {
    return <>Should never show this since we support ReactJS SDK for everything...</>;
}

function DefaultRNTabItem() {
    return (
        <TabItem value="react-native">
            <div className="admonition admonition-important alert alert--info">
                <div className="admonition-heading">
                    <h5>
                        <span className="admonition-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 14 16">
                                <path fill-rule="evenodd" d="M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z">
                                </path>
                            </svg>
                        </span>
                        coming soon
                    </h5>
                </div>
                <div className="admonition-content">
                    <p>In the meantime, you can subscribe to <a href="https://github.com/supertokens/supertokens-react-native">our react native SDK</a> to get notified about releases.</p>
                </div>
            </div>
        </TabItem>
    );
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
                        not supported / not applicable
                    </h5>
                </div>
                <div className="admonition-content">
                    If this requires a call to the backend, you will need to call <a href="/docs/thirdpartyemailpassword/apis#frontend-driver-interface">our APIs</a> yourself. Otherwise, since you are building your own login UI, you will have to handle this yourself.
                </div>
            </div>
        </TabItem>
    );
}
