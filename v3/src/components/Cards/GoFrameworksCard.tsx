import { AppTypeSelect } from "../Select";
import {
	GoFrameworksSelect,
	useGoFrameworksSelection,
} from "../Select/GoFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function GoFrameworksCardRoot({
	children,
	showAppTypeSelect = false,
}: React.PropsWithChildren<{ showAppTypeSelect?: boolean }>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<GoFrameworksSelect />
				{showAppTypeSelect && <AppTypeSelect />}
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const GoFrameworksCard = Object.assign(GoFrameworksCardRoot, {
	Content: CodeSampleCard.Content(useGoFrameworksSelection),
	Section: CodeSampleCard.Section,
});
