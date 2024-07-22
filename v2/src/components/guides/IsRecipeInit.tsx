import * as React from "react";
import StackViewer from "./StackViewer";

export default function IsRecipeInit(props: React.PropsWithChildren<{
    recipe: string
}>) {

    if (props.recipe === "mfa") {
        return (
            <StackViewer
                showIf={(selection) => {
                    return selection.selectedAuthMethod === "mfa"
                }}
                useDiv={false}
            >{props.children}</StackViewer>
        );
    }

    return (
        <StackViewer
            showIf={(selection) => {
                return selection.selectedAuthMethod.includes(props.recipe);
            }}
            useDiv={false}
        >{props.children}</StackViewer>
    )
}