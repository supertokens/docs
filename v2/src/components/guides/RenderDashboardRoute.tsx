import * as React from "react";
import { getSelection } from "./utils"


export default function RenderDashboardRoute() {

    const selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    let path = ""

    if (selection.backend === "nextjs" || selection.backend === "remix") {
        path = "http://localhost:3000/api/auth/dashboard"
    } else {
        path = "http://localhost:3001/auth/dashboard"
    }

    return (
        <code>{path}</code>
    )
}