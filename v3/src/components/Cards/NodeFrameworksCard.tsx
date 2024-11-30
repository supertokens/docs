import {
	NodeFrameworksSelect,
	useNodeFrameworksSelection,
} from "../Select/NodeFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function NodeFrameworksCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<NodeFrameworksSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const NodeFrameworksCard = Object.assign(NodeFrameworksCardRoot, {
	Content: CodeSampleCard.Content(useNodeFrameworksSelection),
});
