import * as React from "react";
import { getSelection } from "./utils"


export default function RenderWebsiteDomain() {

    const selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    let path = ""

    if (selection.frontend === "nextjs" || selection.frontend === "remix") {
        path = "http://localhost:3000"
    } else {
        path = "http://localhost:3000"
    }

    return (
        <code>{path}</code>
    )
}