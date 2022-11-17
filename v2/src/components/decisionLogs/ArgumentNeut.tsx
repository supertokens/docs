import * as React from "react";

import "./decisionLogs.css";

export default function ArgumentNeut(props: React.PropsWithChildren<unknown>) {
    return <li className="neut">{props.children}</li>;
}