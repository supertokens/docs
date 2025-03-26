import { NodePackageManagerSelect, useNodePackageManagerSelection } from "../Select/NodePackageManagerSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function NodePackageManagerCardRoot({ children }: React.PropsWithChildren<{}>) {
  return (
    <CodeSampleCard>
      <CodeSampleCard.Header>
        <NodePackageManagerSelect />
      </CodeSampleCard.Header>
      {children}
    </CodeSampleCard>
  );
}

export const NodePackageManagerCard = Object.assign(NodePackageManagerCardRoot, {
  Content: CodeSampleCard.Content(useNodePackageManagerSelection),
});
