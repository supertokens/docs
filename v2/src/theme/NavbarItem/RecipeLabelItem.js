import React from 'react';
import { isMobile } from 'react-device-detect';

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
            }}>{" | "}</span><a href="https://supertokens.com/docs/guides">See All Recipes</a></span>
    );
}