import { AppTypeSelect } from "../Select";
import {
	NodeFrameworksSelect,
	useNodeFrameworksSelection,
} from "../Select/NodeFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function NodeFrameworksCardRoot({
	children,
	showAppTypeSelect = false,
}: React.PropsWithChildren<{ showAppTypeSelect?: boolean }>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<NodeFrameworksSelect />
				{showAppTypeSelect && <AppTypeSelect />}
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const NodeFrameworksCard = Object.assign(NodeFrameworksCardRoot, {
	Content: CodeSampleCard.Content(useNodeFrameworksSelection),
	Section: CodeSampleCard.Section,
});
