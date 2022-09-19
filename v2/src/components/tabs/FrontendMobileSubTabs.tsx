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
                { label: 'iOS', value: 'ios' }
            ]}>
            {props.children}
        </Tabs>
    );
}