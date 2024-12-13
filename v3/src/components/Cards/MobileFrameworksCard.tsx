import {
	MobileFrameworksSelect,
	useMobileFrameworksSelection,
} from "../Select/MobileFrameworksSelect";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function MobileFrameworksCardRoot({ children }: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<MobileFrameworksSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const MobileFrameworksCard = Object.assign(MobileFrameworksCardRoot, {
	Content: CodeSampleCard.Content(useMobileFrameworksSelection),
	Section: CodeSampleCard.Section,
});
