import * as React from "react";
import { getSelection, isMFAEnabled } from "./utils"


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
        if (isMFAEnabled()) {
            path = "/authServer/config.ts"
        }
    } else if (selection.backend === "python") {
        path = "/backend/config.py"
        if (isMFAEnabled()) {
            path = "/authServer/config.ts"
        }
    } else {
        path = "/authServer/config.ts"
    }

    return (
        <code>{path}</code>
    )
}