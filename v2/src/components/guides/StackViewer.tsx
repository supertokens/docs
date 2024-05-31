import * as React from "react";
import { getSelection, BackendChoice, FrontendChoice, FirstFactors, SecondFactors } from "./utils"

export default function StackView(props: React.PropsWithChildren<{
    showIf(selection: {
        frontend: FrontendChoice,
        backend: BackendChoice,
        tenants: ({
            tenantId: string,
            firstFactors: FirstFactors,
            secondFactors: SecondFactors
        })[]
    }): boolean
}>) {
    let selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    if (props.showIf(selection)) {
        return props.children === undefined ? null : <div>{props.children}</div>;
    }

    return null;
}