import * as React from "react";

import "./decisionLogs.css";
import DecisionStatusAdmonition from "./DecisionStatusAdmonition";

function getLinkList(userNames: string[]): Array<React.ReactChild> {
  return userNames.reduce((acc, uname) => {
    const currLink = <a href={`https://github.com/${uname}`} key={uname}>{uname}</a>
    if (acc.length > 0) {
      return acc.concat([", ", currLink]);
    }
    return [currLink];
  }, [] as Array<React.ReactChild>);
}

export default function DecisionHeader(props: {
  created: string;
  lastUpdate?: string;
  status: "proposed" | "accepted" | "rejected" | "deprecated" | "superseded";
  deciders: string[] | string;
  proposedBy: string[] | string;
}) {
  const { status, lastUpdate, created} = props;
  const deciders = props.deciders instanceof Array ? props.deciders : [props.deciders];
  const proposedBy = props.proposedBy instanceof Array ? props.proposedBy : [props.proposedBy];

  return (
    <>
      { status === "proposed" && <DecisionStatusAdmonition type={"tip"} message="This is just a proposal so far, it hasn't been accepted and needs further discussion." />}
      { status === "rejected" && <DecisionStatusAdmonition type={"caution"} message="This proposal has been rejected and will not be implemented." />}
      { status === "superseded" && <DecisionStatusAdmonition type={"info"} message="This decision has been superseded by another one." />}
      { status === "deprecated" && <DecisionStatusAdmonition type={"note"} message="This decision has been deprecated." />}

      <dl className="decisionHeader">
        <dt>Status: </dt>
        <dd className={`decisionStatus-${status}`}>{status}</dd>

        <dt>Deciders: </dt>
        <dd>{getLinkList(deciders)}</dd>

        <dt>Proposed by: </dt>
        <dd>{getLinkList(proposedBy)}</dd>

        <dt>Created: </dt>
        <dd>{created}</dd>

        {lastUpdate !== undefined && created !== lastUpdate && (
          <>
            <dt>Last updated: </dt>
            <dd>{lastUpdate}</dd>
          </>
        )}
      </dl>
    </>
  );
}
