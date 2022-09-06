import React from "react";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;
import { childContainsTabItemWithValue } from "./utils";
import { recursiveMapAllChildren } from "../utils";
import AngularUIImplementation from "../reusableSnippets/angularUIImplementation";
import VueUIImplementation from "../reusableSnippets/vueUIImplementation";
import { Answer } from "../question"

const copyTabIdentifier = "~COPY-TABS=";

export default function FrontendPreBuiltUITabs(props: any) {
  // this is done twice since vue has a copy tabs pointing at angular and angular also has copy tabs
  return applyCopyTabs(applyCopyTabs(<Tabs
    groupId="frontendsdk"
    defaultValue="reactjs"
    values={[
      { label: "ReactJS", value: "reactjs" },
      { label: "Angular", value: "angular" },
      { label: "Vue", value: "vue" }
    ]}
  >
    {childContainsTabItemWithValue("reactjs", props.children)
      ? null
      : DefaultReactJSTabItem()}
    {childContainsTabItemWithValue("angular", props.children)
      ? null
      : DefaultAngularTabItem()}
    {childContainsTabItemWithValue("vue", props.children)
      ? null
      : DefaultVueTabItem()}
    {props.children}
  </Tabs>))
}

export function applyCopyTabs(children: any): any {
  return recursiveMapAllChildren(
    children,
    (child: any) => {
      if (!React.isValidElement(child.props.children) && typeof child.props.children === "string" &&
        child.props.children.startsWith(copyTabIdentifier)) {
        let tabToCopyIdentifiers = child.props.children.split(copyTabIdentifier)[1].trim().split(",");
        for (let i = 0; i < tabToCopyIdentifiers.length; i++) {
          let result = undefined;
          recursiveMapAllChildren(children, (child: any) => {
            if (child.props && child.props.mdxType === "TabItem" && child.props.value === tabToCopyIdentifiers[i]) {
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
    <TabItem value="angular" mdxType="TabItem">
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
              SuperTokens does not provide non-React UI components. So we will be using the <code>supertokens-auth-react</code> SDK and will inject the React components to show the UI. Therefore, the code snippet below refers to the <code>supertokens-auth-react</code> SDK.
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

function DefaultVueTabItem() {
  return (
    <TabItem value="vue" mdxType="TabItem">
      <VueUIImplementation>
        ~COPY-TABS=angular
      </VueUIImplementation>
    </TabItem>
  );
}
