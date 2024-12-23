import {
	NpmOrScriptsSelect,
	useNpmOrScriptsSelection,
} from "../Select/NpmOrScriptsSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function NpmOrScriptsCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<NpmOrScriptsSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const NpmOrScriptsCard = Object.assign(NpmOrScriptsCardRoot, {
	Content: CodeSampleCard.Content(useNpmOrScriptsSelection),
	Section: CodeSampleCard.Section,
});
