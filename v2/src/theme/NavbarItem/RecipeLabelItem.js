import React from 'react';
import { BrowserView, isMobile } from 'react-device-detect';
import GuidesLink from "../../components/guidesLink";

export default function RecipeLabelItem(props) {
    return <BrowserView>{
        !isMobile && <span
        style={{
            fontSize: "16px",
            fontStyle: "italic"
        }}>{props.label}<span style={{
            fontStyle: "normal"
        }}>{" | "}</span><GuidesLink>See All Recipes</GuidesLink></span>
    }</BrowserView>
}