import React from 'react';
import { isMobile } from 'react-device-detect';
import GuidesLink from "../../components/guidesLink";

export default function RecipeLabelItem(props) {
    if (isMobile) {
        return null;
    }
    return (
        <span
            style={{
                fontSize: "16px",
                fontStyle: "italic"
            }}>{props.label}<span style={{
                fontStyle: "normal"
            }}>{" | "}</span><GuidesLink>See All Recipes</GuidesLink></span>
    );
}