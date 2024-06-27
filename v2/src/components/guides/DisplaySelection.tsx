import * as React from "react";
import { getSelection, BackendChoice } from "./utils"

export default function BackendView(props: {
    children: React.ReactNode,
    backend: BackendChoice
}) {
    let selection = getSelection();

    return <div>{JSON.stringify(selection)}</div>
}