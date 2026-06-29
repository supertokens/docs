import { PythonPackageManagerSelect, usePythonPackageManagerSelection } from "../Select/PythonPackageManagerSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function PythonPackageManagerCardRoot({ children }: React.PropsWithChildren<{}>) {
  return (
    <CodeSampleCard>
      <CodeSampleCard.Header>
        <PythonPackageManagerSelect />
      </CodeSampleCard.Header>
      {children}
    </CodeSampleCard>
  );
}

export const PythonPackageManagerCard = Object.assign(PythonPackageManagerCardRoot, {
  Content: CodeSampleCard.Content(usePythonPackageManagerSelection),
});
