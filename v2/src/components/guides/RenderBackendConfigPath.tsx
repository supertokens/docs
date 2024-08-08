import * as React from "react";
import { getSelection } from "./utils"


export default function RenderBackendConfigPath() {

    const selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    let path = ""

    if (selection.backend === "nodejs") {
        path = "/backend/config.ts"
    } else if (selection.backend === "nextjs" || selection.backend === "remix") {
        path = "/config/backendConfig.ts"
    } else if (selection.backend === "golang") {
        path = "/backend/config.go"
    } else if (selection.backend === "python") {
        path = "/backend/config.py"
    } else {
        throw new Error("Should never come here")
    }

    return (
        <code>{path}</code>
    )
}