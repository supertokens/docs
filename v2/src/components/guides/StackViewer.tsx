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
    useDiv?: boolean
}>): any {
    let selection = getSelection();

    if (selection === undefined) {
        return null;
    }

    if (props.showIf(selection)) {
        return props.children === undefined ? null : (props.useDiv === undefined || props.useDiv ? <div>{props.children}</div> : props.children);
    }

    return null;
}