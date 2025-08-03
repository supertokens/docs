import { MutableRefObject, createContext, useContext, useRef } from "react";
import { AppTypeSelect } from "../Select";
import { NodeFrameworksSelect, useNodeFrameworksSelection } from "../Select/NodeFrameworksSelect";
import ReactDOM from "react-dom";

import { CodeSampleCard } from "./CodeSampleCard";
import { Flex } from "@radix-ui/themes";

import "./styles.scss";

type NodeFrameworksCardContextType = { cardHeaderPortalRightSideContentRef: MutableRefObject<HTMLDivElement> };
const NodeFrameworksCardContext = createContext<NodeFrameworksCardContextType>({} as NodeFrameworksCardContextType);

function NodeFrameworksCardRoot({
  children,
  showAppTypeSelect = false,
  exclude = [],
}: React.PropsWithChildren<{ showAppTypeSelect?: boolean; exclude?: string[] }>) {
  const cardHeaderPortalRightSideContentRef = useRef<HTMLDivElement>(null);
  return (
    <NodeFrameworksCardContext.Provider value={{ cardHeaderPortalRightSideContentRef }}>
      <CodeSampleCard>
        <CodeSampleCard.Header>
          <NodeFrameworksSelect exclude={exclude} />
          <Flex gap="1" ref={cardHeaderPortalRightSideContentRef}>
            {showAppTypeSelect && <AppTypeSelect />}
          </Flex>
        </CodeSampleCard.Header>
        {children}
      </CodeSampleCard>
    </NodeFrameworksCardContext.Provider>
  );
}

function HeaderCustomActions({ children }: React.PropsWithChildren) {
  const { cardHeaderPortalRightSideContentRef } = useContext(NodeFrameworksCardContext);

  if (!cardHeaderPortalRightSideContentRef.current) return null;
  return ReactDOM.createPortal(children, cardHeaderPortalRightSideContentRef.current);
}

export const NodeFrameworksCard = Object.assign(NodeFrameworksCardRoot, {
  Content: CodeSampleCard.Content(useNodeFrameworksSelection),
  Section: CodeSampleCard.Section,
  HeaderCustomActions,
});
