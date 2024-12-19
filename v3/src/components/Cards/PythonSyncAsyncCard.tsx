import {
	PythonSyncAsyncSelect,
	usePythonSyncAsyncSelection,
} from "../Select/PythonSyncAsyncSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function PythonSyncAsyncCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<PythonSyncAsyncSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const PythonSyncAsyncCard = Object.assign(PythonSyncAsyncCardRoot, {
	Content: CodeSampleCard.Content(usePythonSyncAsyncSelection),
});
