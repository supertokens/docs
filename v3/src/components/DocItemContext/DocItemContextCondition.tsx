import { useContext } from "react";
import { DocItemContext } from "./DocItemContext";
import { DocsItemStateType } from "./DocItemStore";
import { getContextValue } from "./DocItemContextValue";

export function ContextCondition({
	condition,
	children,
}: {
	condition: ((state: DocsItemStateType) => boolean) | Record<string, string>;
	children: React.ReactNode;
}) {
	const state = useContext(DocItemContext);
	let matches: boolean;
	if (typeof condition === "function") {
		matches = condition(state);
	} else {
		matches = Object.keys(condition).every((propertyKey) => {
			return condition[propertyKey] === getContextValue(state, propertyKey);
		});
	}

	if (!matches) return null;
	return <>{children}</>;
}
