import React from 'react';
import { isMobile } from 'react-device-detect';
import BrowserOnly from '@docusaurus/BrowserOnly';
import GuidesLink from "../../components/guidesLink";

export default function RecipeLabelItem(props) {
    return <BrowserOnly>{
        !isMobile && <span
        style={{
            fontSize: "16px",
            fontStyle: "italic"
        }}>{props.label}<span style={{
            fontStyle: "normal"
        }}>{" | "}</span><GuidesLink>See All Recipes</GuidesLink></span>
    }</BrowserOnly>
}