import * as React from "react";

import "./decisionLogs.css";

export default function ArgumentPro(props: React.PropsWithChildren<unknown>) {
    return <li className="pro">{props.children}</li>;
}