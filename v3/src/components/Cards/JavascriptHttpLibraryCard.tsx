import { JavascriptHttpLibrarySelect, useJavascriptHttpLibrarySelection } from "../Select/JavascriptHttpLibrarySelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function JavascriptHttpLibraryCardRoot({ children }: React.PropsWithChildren<{}>) {
  return (
    <CodeSampleCard>
      <CodeSampleCard.Header>
        <JavascriptHttpLibrarySelect />
      </CodeSampleCard.Header>
      {children}
    </CodeSampleCard>
  );
}

export const JavascriptHttpLibraryCard = Object.assign(JavascriptHttpLibraryCardRoot, {
  Content: CodeSampleCard.Content(useJavascriptHttpLibrarySelection),
  Section: CodeSampleCard.Section,
});
