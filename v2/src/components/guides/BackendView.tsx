import * as React from "react";
import { BackendChoice } from "./utils"
import StackViewer from "./StackViewer";

export default function BackendView(props: React.PropsWithChildren<{
    backend: BackendChoice
}>) {
    return (
        <StackViewer
            showIf={(selection) => {
                return selection.backend === props.backend;
            }}
        >{props.children}</StackViewer>
    )
}