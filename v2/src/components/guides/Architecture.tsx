import * as React from "react";
import { getSelection } from "./utils"

export default function Architecture(props: {
    children: React.ReactNode,
    isWithSeparateNodeAuthServer: boolean
}) {
    let selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    let showWithSeparateNodeAuthServer = selection.applicationServer !== undefined;

    if (showWithSeparateNodeAuthServer === props.isWithSeparateNodeAuthServer) {
        return props.children;
    }

    return null;
}