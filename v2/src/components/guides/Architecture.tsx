import * as React from "react";
import { getSelection, isMFAEnabled } from "./utils"

export default function Architecture(props: {
    children: React.ReactNode,
    isWithSeparateNodeAuthServer: boolean
}) {
    let selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    let showWithSeparateNodeAuthServer = true;

    if (selection.backend === "nodejs" || selection.backend === "nextjs" || selection.backend === "remix") {
        showWithSeparateNodeAuthServer = false;
    }
    if (selection.backend === "python" || selection.backend === "golang") {
        if (!isMFAEnabled()) {
            showWithSeparateNodeAuthServer = false;
        }
    }

    if (showWithSeparateNodeAuthServer === props.isWithSeparateNodeAuthServer) {
        return props.children;
    }

    return null;
}