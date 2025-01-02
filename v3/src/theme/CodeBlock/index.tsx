import React, { isValidElement, useContext, type ReactNode } from "react";
import useIsBrowser from "@docusaurus/useIsBrowser";
import ElementContent from "@theme/CodeBlock/Content/Element";
import StringContent from "@theme/CodeBlock/Content/String";
import type { Props } from "@theme/CodeBlock";
import {
	DocItemContext,
	getContextValue,
} from "@site/src/components/DocItemContext";
import { DOC_STORE_DEFAULT_VALUES } from "@site/src/lib/constants";

/**
 * Best attempt to make the children a plain string so it is copyable. If there
 * are react elements, we will not be able to copy the content, and it will
 * return `children` as-is; otherwise, it concatenates the string children
 * together.
 */
function maybeStringifyChildren(children: ReactNode): ReactNode {
	if (React.Children.toArray(children).some((el) => isValidElement(el))) {
		return children;
	}
	// The children is now guaranteed to be one/more plain strings
	return Array.isArray(children) ? children.join("") : (children as string);
}

// TODO: Limit this to only string code blocks
// This way we prevent using <pre> tags and just handle ``` blocks
export default function CodeBlock({
	children: rawChildren,
	...props
}: Props): JSX.Element {
	// The Prism theme on SSR is always the default theme but the site theme can
	// be in a different mode. React hydration doesn't update DOM styles that come
	// from SSR. Hence force a re-render after mounting to apply the current
	// relevant styles.
	const isBrowser = useIsBrowser();
	const children = maybeStringifyChildren(rawChildren);
	const CodeBlockComp =
		typeof children === "string" ? StringContent : ElementContent;
	const context = useContext(DocItemContext);
	const dynamicValuesRegex = /\^\{([^}]+)\}/g;

	let parsedChildren = children;
	if (typeof children === "string") {
		parsedChildren = children.replaceAll(dynamicValuesRegex, (match, key) => {
			const value = getContextValue(
				context,
				key,
				DOC_STORE_DEFAULT_VALUES[key],
			);
			return (value as string) || "";
		});
	}

	return (
		<CodeBlockComp key={String(isBrowser)} {...props}>
			{parsedChildren as string}
		</CodeBlockComp>
	);
}
