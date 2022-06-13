import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue, COPY_TABS } from "./utils";
let tabsUsingCopyDocs: string[] = [];

export default function FrontendSDKTabs(props: any) {
  tabsUsingCopyDocs = [];
  return (
    <Tabs
      groupId="frontendsdk"
      defaultValue="reactjs"
      values={[
        { label: "ReactJS", value: "reactjs" },
        { label: "Plain JavaScript", value: "vanillajs" },
        { label: "React Native", value: "react-native" },
        { label: "Angular", value: "angular" },
      ]}
    >
      {childContainsTabItemWithValue("reactjs", props.children)
        ? null
        : DefaultReactJSTabItem()}
      {childContainsTabItemWithValue("vanillajs", props.children)
        ? null
        : DefaultVanillaJSTabItem()}
      {childContainsTabItemWithValue("react-native", props.children)
        ? null
        : DefaultRNTabItem()}
      {childContainsCopyTabs("angular", props.children, DefaultAngularTabItem)}
      {printWithoutCopyTabs(props.children)}
    </Tabs>
  );
}

function DefaultReactJSTabItem() {
    return <>Should never show this since we support ReactJS SDK for everything...</>;
}

function DefaultRNTabItem() {
    return (
        <TabItem value="react-native">
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
                    To use SuperTokens with React Native you need to use the <code>supertokens-react-native</code> SDK. The SDK provides session management features.<br/><br/>
                    
                    To add login functionality, you need to build your own UI and call the APIs exposed by the backend SDKs. You can find the API spec <a href="https://supertokens.com/docs/fdi">here</a>
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
                        Note
                    </h5>
                </div>
                <div className="admonition-content">
                    To use SuperTokens with plain javascript you need to use the <code>supertokens-website</code> SDK. The SDK provides session management features.<br/><br/>

                    To add login functionality, you need to build your own UI and call the APIs exposed by the backend SDKs. You can find the API spec <a href="https://supertokens.com/docs/fdi">here</a><br/><br/>

                    You can refer to <a href="https://supertokens.com/blog/adding-social-login-to-your-website-with-supertokens">this blog post</a> to know how this is done, the example uses social login but the same setup applies to other recipes as well.
                </div>
            </div>
        </TabItem>
    );
}

function DefaultAngularTabItem() {
  return <TabItem value="angular">Default component</TabItem>;
}

function childContainsCopyTabs(
  value: string,
  children: any,
  defaultOutput: any
) {
  for (let child in children) {
    if (children[child] === undefined || children[child] === null) {
      continue;
    }
    if (children[child].value === value) {
        return copyTabs(value, children[child].children, children)
    }
    if (children[child].props === undefined) {
      continue;
    }
    if (children[child].props.value === value) {
      return copyTabs(value, children[child].props.children, children);
    }
  }
  return defaultOutput();
}

function copyTabs(
  copyTabId: string,
  copyTabComponent: any,
  allComponents: any
) {
  let tabToCopyId;
  let finalCopyTabComponent: any[] = [];

  for (let child in copyTabComponent) {
    if (
      typeof copyTabComponent[child].props.children === "string" &&
      copyTabComponent[child].props.children.includes(COPY_TABS)
    ) {
      tabToCopyId = copyTabComponent[child].props.children.split(COPY_TABS)[1];
    } else {
      finalCopyTabComponent.push(copyTabComponent[child]);
    }
  }

  for (let child in allComponents) {
    if (allComponents[child].props.value === tabToCopyId) {
      tabsUsingCopyDocs.push(copyTabId);
      return (
        <TabItem value={copyTabId}>
          {finalCopyTabComponent}
          {allComponents[child].props.children}
        </TabItem>
      );
    }
  }
}

function printWithoutCopyTabs(children: any) {
  let response = [];
  for (let child in children) {
    if (!tabsUsingCopyDocs.includes(children[child].props.value)) {
      response.push(children[child]);
    }
  }
  return response;
}
