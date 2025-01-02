import {
	ThirdPartyBuiltinProvidersSelect,
	useThirdPartyBuiltinProvidersSelection,
} from "../Select";

import { CodeSampleCard } from "./CodeSampleCard";

import "./styles.scss";

function ThirdPartyBuiltinProvidersCardRoot({
	children,
}: React.PropsWithChildren<{}>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<ThirdPartyBuiltinProvidersSelect />
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const ThirdPartyBuiltinProvidersCard = Object.assign(
	ThirdPartyBuiltinProvidersCardRoot,
	{
		Content: CodeSampleCard.Content(useThirdPartyBuiltinProvidersSelection),
	},
);
