import {
	PasswordlessFlowTypeSelect,
	PasswordlessContactMethodSelect,
} from "../Select";

import { CodeSampleCard } from "./CodeSampleCard";
import { Tooltip } from "@radix-ui/themes";

import "./styles.scss";

function PasswordlessConfigCardRoot({
	children,
	showFlowType = false,
}: React.PropsWithChildren<{ showFlowType?: boolean }>) {
	return (
		<CodeSampleCard>
			<CodeSampleCard.Header>
				<Tooltip content="The method used to idenitfy your users.">
					<PasswordlessContactMethodSelect />
				</Tooltip>
				{showFlowType && <PasswordlessFlowTypeSelect />}
			</CodeSampleCard.Header>
			{children}
		</CodeSampleCard>
	);
}

export const PasswordlessConfigCard = Object.assign(
	PasswordlessConfigCardRoot,
	{
		Section: CodeSampleCard.Section,
	},
);
