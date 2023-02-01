import React from "react";
let Tabs = require("@theme/Tabs").default;
import { childContainsTabItemWithValue } from "./utils";
let TabItem = require("@theme/TabItem").default;
import { applyCopyTabs } from "./FrontendPreBuiltUITabs"

export default function FrontendMobileSubTabs(props: any) {
    return applyCopyTabs(
        <Tabs
            isSubTab={true}
            groupId="frontend-mobile-tabs"
            defaultValue="reactnative"
            values={[
                { label: 'React Native', value: 'reactnative' },
                { label: 'Android', value: 'android' },
                { label: 'iOS', value: 'ios' },
                { label: 'Flutter', value: 'flutter' }
            ]}>
            {/* {childContainsTabItemWithValue("ios", props.children)
                ? null
                : DefaultiOSTabItem()} */}
            {props.children}
        </Tabs>
    );
}

function DefaultiOSTabItem() {
    // we add a div cause COPY-TABS won't work
    // as a direct child of TabItem.
    return (
        <TabItem value="ios" mdxType="TabItem">
            <div>
                ~COPY-TABS=android
            </div>
        </TabItem>
    );
}
