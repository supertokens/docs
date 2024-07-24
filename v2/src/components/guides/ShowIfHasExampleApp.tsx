import * as React from "react";
import { getSelection } from "./utils"

export default function ShowIfHasExamlpeApp(props: {
    children: React.ReactNode
}) {
    let selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    if (selection.isCustomUI || selection.applicationServer !== undefined) {
        return null;
    }

    if (selection.frontend === "nextjs" && selection.backend === "nextjs") {
        return props.children;
    }

    if (selection.frontend === "remix" && selection.backend === "remix") {
        return props.children;
    }

    if (!(selection.frontend === "react" || selection.frontend === "angular" || selection.frontend === "vue")) {
        return null;
    }

    if (!(selection.backend === "nodejs" || selection.backend === "python" || selection.backend === "golang")) {
        return null;
    }

    if (selection.backend === "nodejs") {
        if (selection.backendFramework === "nodejs-other") {
            return null;
        }
    }

    return props.children;
}