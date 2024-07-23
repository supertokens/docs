import * as React from "react";
import { getSelection, } from "./utils"


export default function RenderAPIDomain() {

    const selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    let path = ""

    if (selection.backend === "nextjs" || selection.backend === "remix") {
        path = "http://localhost:3000"
    } else {
        path = "http://localhost:3001"
    }

    return (
        <code>{path}</code>
    )
}