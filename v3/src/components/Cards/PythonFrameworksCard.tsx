import { AppTypeSelect } from "../Select";
import {
	PythonFrameworksSelect,
	usePythonFrameworksSelection,
} from "../Select/PythonFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function PythonFrameworksCardRoot({
	children,
	showAppTypeSelect = false,
}: React.PropsWithChildren<{ showAppTypeSelect?: boolean }>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<PythonFrameworksSelect />
				{showAppTypeSelect && <AppTypeSelect />}
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const PythonFrameworksCard = Object.assign(PythonFrameworksCardRoot, {
	Content: CodeSampleCard.Content(usePythonFrameworksSelection),
	Section: CodeSampleCard.Section,
});
