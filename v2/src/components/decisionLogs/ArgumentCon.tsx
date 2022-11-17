import * as React from "react";

import "./decisionLogs.css";

export default function ArgumentCon(props: React.PropsWithChildren<unknown>) {
    return <li className="con">{props.children}</li>;
}