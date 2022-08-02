import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";

export default function CustomUITabs(props: any) {
    return (
        <Tabs
            groupId="customui"
            defaultValue="web"
            values={[
                { label: "Web", value: "web" },
                { label: "Mobile", value: "mobile" },
            ]}>
                {props.children}
        </Tabs>
    );
}

export function FrontendWebSubTabs(props: any) {
  return (
    <Tabs
        isSubTab={true}
        groupid="websub"
        defaultValue="npm"
        values={[
            { label: "Via npm", value: "npm" },
            { label: "Via Script Tag", value: "script" },
        ]}>
            {props.children}
    </Tabs>
);
}

export function FrontendMobileSubTabs(props: any) {
    return (
        <Tabs
            isSubTab={true}
            groupid="mobileui"
            defaultValue="reactnative"
            values={[
                { label: "React Native", value: "reactnative" },
                { label: "Android", value: "android" },
                { label: "iOS", value: "ios" },
            ]}>
                { childContainsTabItemWithValue("reactnative", props.children) 
                ? null
                : DefaultRNTabItem() }

                { childContainsTabItemWithValue("android", props.children) 
                ? null
                : DefaultAndroidTabItem() }

                { childContainsTabItemWithValue("ios", props.children) 
                ? null
                : DefaultIOSTabItem() }
                {props.children}
        </Tabs>
    );
}

function DefaultRNTabItem() {
    return (
      <TabItem value="reactnative" mdxType="TabItem">
        <div className="admonition admonition-caution alert alert--warning">
          <div className="admonition-heading">
            <h5>
              <span className="admonition-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z">
                  </path>
                </svg>
              </span>
              Note
            </h5>
          </div>
          <div className="admonition-content">
            To use SuperTokens with React Native you need to use the <code>supertokens-react-native</code> SDK. The SDK provides session management features.<br /><br />
  
            To add login functionality, you need to build your own UI and call the APIs exposed by the backend SDKs. You can find the API spec <a href="https://supertokens.com/docs/fdi">here</a>
          </div>
        </div>
      </TabItem>
    );
  }

  function DefaultAndroidTabItem() {
    return (
      <TabItem value="android" mdxType="TabItem">
        <div className="admonition admonition-caution alert alert--warning">
          <div className="admonition-heading">
            <h5>
              <span className="admonition-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z">
                  </path>
                </svg>
              </span>
              Note
            </h5>
          </div>
          <div className="admonition-content">
            To use SuperTokens with Native Android you need to use the <code>supertokens-android</code> SDK. The SDK provides session management features.<br /><br />
  
            To add login functionality, you need to build your own UI and call the APIs exposed by the backend SDKs. You can find the API spec <a href="https://supertokens.com/docs/fdi">here</a>
          </div>
        </div>
      </TabItem>
    );
  }

  function DefaultIOSTabItem() {
    return (
      <TabItem value="ios" mdxType="TabItem">
        <div className="admonition admonition-caution alert alert--warning">
          <div className="admonition-heading">
            <h5>
              <span className="admonition-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z">
                  </path>
                </svg>
              </span>
              Note
            </h5>
          </div>
          <div className="admonition-content">
            The SDK for Native iOS is currently being worked on, to add login functionality, you need to build your own UI and call the APIs exposed by the backend SDKs. You can find the API spec <a href="https://supertokens.com/docs/fdi">here</a>
          </div>
        </div>
      </TabItem>
    );
  }