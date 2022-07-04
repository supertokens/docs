import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";
import { recursiveMapAllChildren } from "../utils";
import AngularUIImplementation from "../reusableSnippets/angularUIImplementation";
import { Answer } from "../question"

const copyTabIdentifier = "~COPY-TABS=";

export default function FrontendSDKTabs(props: any) {
  return applyCopyTabs(<Tabs
    groupId="frontendsdk"
    defaultValue="reactjs"
    values={[
      { label: "ReactJS", value: "reactjs" },
      { label: "Angular", value: "angular" },
      { label: "Plain JavaScript", value: "vanillajs" },
      { label: "React Native", value: "react-native" },
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
    {childContainsTabItemWithValue("angular", props.children)
      ? null
      : DefaultAngularTabItem()}
    {props.children}
  </Tabs>)
}

function applyCopyTabs(children: any): any {
  return recursiveMapAllChildren(
    children,
    (child: any) => {
      if (!React.isValidElement(child.props.children) && typeof child.props.children === "string" &&
        child.props.children.startsWith(copyTabIdentifier)) {
        let tabToCopyIdentifiers = child.props.children.split(copyTabIdentifier)[1].trim().split(",");
        for (let i = 0; i < tabToCopyIdentifiers.length; i++) {
          let result = undefined;
          recursiveMapAllChildren(children, (child: any) => {
            if (child.props && (child.props.mdxType === "TabItem" || (child.type && child.type.name === "TabItem")) && child.props.value === tabToCopyIdentifiers[i]) {
              result = child.props.children
            }
            return child
          })
          if (result !== undefined) {
            return result;
          }
        }
      }
      return child;
    },
  );
}

function DefaultReactJSTabItem() {
  return <>Should never show this since we support ReactJS SDK for everything...</>;
}

function DefaultAngularTabItem() {
  return (
    <TabItem value="angular">
      <AngularUIImplementation>
        <Answer title="Prebuilt UI">
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
              SuperTokens does not provide prebuilt UI for Angular. Instead we will be using the <code>supertokens-auth-react</code> SDK to render login UI. Therefore, the code snippet below refers to the <code>supertokens-auth-react</code> SDK.
            </div>
          </div>
          <div>
            ~COPY-TABS=reactjs
          </div>
        </Answer>
        <Answer title="Custom UI">
          <div>
            ~COPY-TABS=npm,vanillajs
          </div>
        </Answer>
      </AngularUIImplementation>
    </TabItem>
  );
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
          To use SuperTokens with React Native you need to use the <code>supertokens-react-native</code> SDK. The SDK provides session management features.<br /><br />

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
          This section may not be relevant to you because you are making your own UI.<br /><br />


          That being said, we recommend that you use the <code>supertokens-web-js</code> SDK which exposes several helper functions that query the <a target="_blank" href="https://app.swaggerhub.com/apis/supertokens/FDI">APIs exposed by SuperTokens backend SDK</a>.<br /><br />

          We are working on the docs to add more details about this SDK. In the meantime, you can  <a target="_blank" href="https://supertokens.com/docs/web-js/modules.html">checkout the SDKs reference docs</a>.
        </div>
      </div>
    </TabItem>
  );
}
