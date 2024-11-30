import {
	PythonFrameworksSelect,
	usePythonFrameworksSelection,
} from "../Select/PythonFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function PythonFrameworksCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<PythonFrameworksSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const PythonFrameworksCard = Object.assign(PythonFrameworksCardRoot, {
	Content: CodeSampleCard.Content(usePythonFrameworksSelection),
});
