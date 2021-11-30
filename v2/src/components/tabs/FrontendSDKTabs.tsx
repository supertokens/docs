import React from "react";
import ReactAdmonition from "../reactAdmonition/ReactAdmonition";
let Tabs = require("@theme/Tabs").default;
let TabItem = require("@theme/TabItem").default;

export default function FrontendSDKTabs(props) {
    return (
        <>
            <Tabs
                groupId="frontendsdk"
                defaultValue="reactjs"
                values={[
                    { label: 'ReactJS', value: 'reactjs' },
                    { label: 'Plain JavaScript', value: 'vanillajs' },
                    { label: 'React Native', value: 'react-native' },
                ]}
                alternateTabContent={props.alternateTabContent}
                defaultTabContent={{
                    "reactjs": DefaultReactJSTabItem,
                    "vanillajs": DefaultVanillaJSTabItem,
                    "react-native": DefaultRNTabItem 
                }}
            >
                {props.children}
            </Tabs>
        </>
    );
}

function DefaultReactJSTabItem() {
    return <>Should never show this since we support ReactJS SDK for everything...</>;
}

function DefaultRNTabItem() {
    return (
        <ReactAdmonition
            type="warning"
            title="not supported / not applicable"
        >
            If this requires a call to the backend, you will need to call <a href="/docs/thirdpartyemailpassword/apis#frontend-driver-interface">our APIs</a> yourself. Otherwise, since you are building your own login UI, you will have to handle this yourself.
        </ReactAdmonition>
    );
}


function DefaultVanillaJSTabItem() {
    return (
        <ReactAdmonition
            type="warning"
            title="not supported / not applicable"
        >
            If this requires a call to the backend, you will need to call <a href="/docs/thirdpartyemailpassword/apis#frontend-driver-interface">our APIs</a> yourself. Otherwise, since you are building your own login UI, you will have to handle this yourself.
        </ReactAdmonition>
    );
}
