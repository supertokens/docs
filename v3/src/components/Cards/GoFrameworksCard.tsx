import {
	GoFrameworksSelect,
	useGoFrameworksSelection,
} from "../Select/GoFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function GoFrameworksCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<GoFrameworksSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const GoFrameworksCard = Object.assign(GoFrameworksCardRoot, {
	Content: CodeSampleCard.Content(useGoFrameworksSelection),
});
