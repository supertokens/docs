import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";
import { recursiveMap } from "../utils";
const copyTabIdentifier = "~COPY-TABS=";
const tabValues = ["reactjs", "vanillajs", "react-native", "angular"]


export default function FrontendSDKTabs(props: any) {
  let tabsUsingCopyTabs: string[] = []
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
        ? containsCopyTabs("react-native", props.children, tabsUsingCopyTabs)
          ? applyCopyTabs("react-native", props.children)
          : null
        : DefaultRNTabItem()}
        {childContainsTabItemWithValue("angular", props.children)
        ? containsCopyTabs("angular", props.children, tabsUsingCopyTabs)
          ? applyCopyTabs("angular", props.children)
          : null
        : DefaultAngularTabItem()}
      
      {returnTabsWithoutCopyTabs(props.children, tabsUsingCopyTabs)}
    </Tabs>
  );
}

function returnTabsWithoutCopyTabs(children: any, tabsUsingCopyTabs: string[]){

  return recursiveMap(children, (child: any) => {
    return child
  }, (child: any) => {
      if(tabsUsingCopyTabs.includes(child.props.value)){
        return false
      }
    return true
  } )

}

function applyCopyTabs(tabId: string, children: any): any {

  let isTabContent = false;
  return recursiveMap(
    children,
    (child: any) => {
      if (child.startsWith(copyTabIdentifier)) {
        let tabToCopyIdentifier = child.split(copyTabIdentifier)[1];
        let isCopyTabContent = false
        let contentToInsert = recursiveMap(children, (child: any) => {
          return child
        }, (child) => {
          if(child.props.mdxType === "TabItem" && tabValues.includes(child.props.value)){
            isCopyTabContent = false
          }
          
          if(child.props.value !== tabToCopyIdentifier && !isCopyTabContent){
            return false
          }

          isCopyTabContent = true
          return true
        })
        
        return contentToInsert.props.children
      }
      return child;
    },
    (child) => {

      if(child.props.mdxType === "TabItem" && tabValues.includes(child.props.value)){
        isTabContent = false
      }

      if (child.props.value !== tabId && !isTabContent) {
        return false;
      }

      isTabContent = true;

      return true;
    }
  );

}


function containsCopyTabs(tabId: string, children: any, tabsUsingCopyTabs: string[]): boolean {
  let acceptedChildren: any[] = [];
  recursiveMap(
    children,
    (child: any) => {
      return child;
    },
    (child) => {
      let accepted = false;
      for (let i = 0; i < acceptedChildren.length; i++) {
        let currAcceptedChild = acceptedChildren[i];
        React.Children.forEach(currAcceptedChild, (child2: any) => {
          accepted = accepted || child2 == child;
        });
      }
      if (accepted === false && child.props.value !== tabId) {
        return false;
      }
      acceptedChildren.push(child);
      return true;
    }
  );

  let doesChildContainCopyTabs = false;
  for (let i = 0; i < acceptedChildren.length; i++) {
    let currAcceptedChild = acceptedChildren[i];
    recursiveMap(
      currAcceptedChild,
      (child: any) => {
        doesChildContainCopyTabs = child.includes(copyTabIdentifier);
      },
      () => {
        return !doesChildContainCopyTabs;
      }
    );
  }
  if(doesChildContainCopyTabs){
    tabsUsingCopyTabs.push(tabId)
  }
  return doesChildContainCopyTabs;
}

function DefaultReactJSTabItem() {
  return (
    <>Should never show this since we support ReactJS SDK for everything...</>
  );
}

function DefaultRNTabItem() {
  return (
    <TabItem value="react-native">
      <div className="admonition admonition-caution alert alert--warning">
        <div className="admonition-heading">
          <h5>
            <span className="admonition-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"
                ></path>
              </svg>
            </span>
            Note
          </h5>
        </div>
        <div className="admonition-content">
          To use SuperTokens with React Native you need to use the{" "}
          <code>supertokens-react-native</code> SDK. The SDK provides session
          management features.
          <br />
          <br />
          To add login functionality, you need to build your own UI and call the
          APIs exposed by the backend SDKs. You can find the API spec{" "}
          <a href="https://supertokens.com/docs/fdi">here</a>
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"
                ></path>
              </svg>
            </span>
            Note
          </h5>
        </div>
        <div className="admonition-content">
          To use SuperTokens with plain javascript you need to use the{" "}
          <code>supertokens-website</code> SDK. The SDK provides session
          management features.
          <br />
          <br />
          To add login functionality, you need to build your own UI and call the
          APIs exposed by the backend SDKs. You can find the API spec{" "}
          <a href="https://supertokens.com/docs/fdi">here</a>
          <br />
          <br />
          You can refer to{" "}
          <a href="https://supertokens.com/blog/adding-social-login-to-your-website-with-supertokens">
            this blog post
          </a>{" "}
          to know how this is done, the example uses social login but the same
          setup applies to other recipes as well.
        </div>
      </div>
    </TabItem>
  );
}


function DefaultAngularTabItem() {
  return (
    <TabItem value="angular">
      Default Component
    </TabItem>
  );
}