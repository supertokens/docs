import * as React from "react";
import { FrontendChoice } from "./utils"
import StackViewer from "./StackViewer";

export default function FrontendView(props: React.PropsWithChildren<{
    frontend: FrontendChoice
}>) {
    return (
        <StackViewer
            showIf={(selection) => {
                return selection.frontend === props.frontend;
            }}
        >{props.children}</StackViewer>
    )
}