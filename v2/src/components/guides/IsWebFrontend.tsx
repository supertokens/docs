import * as React from "react";
import { BackendChoice } from "./utils"
import StackViewer from "./StackViewer";

export default function IsWebFrontend(props: React.PropsWithChildren<{
    backend: BackendChoice
}>) {
    return (
        <StackViewer
            showIf={(selection) => {
                return !(["react-native", "flutter", "ios", "android"].includes(selection.frontend === undefined ? "" : selection.frontend));
            }}
            useDiv={false}
        >{props.children}</StackViewer>
    )
}