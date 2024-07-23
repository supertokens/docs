import * as React from "react";
import StackViewer from "./StackViewer";

export default function IsRecipeInit(props: React.PropsWithChildren<{
    recipe: string
}>) {

    return (
        <StackViewer
            showIf={(selection) => {
                return selection.selectedAuthMethod.includes(props.recipe);
            }}
            useDiv={false}
        >{props.children}</StackViewer>
    )
}