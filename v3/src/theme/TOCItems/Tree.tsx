import React, { useCallback } from "react";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/TOCItems/Tree";
import { trackButtonClick } from "@site/src/lib/analytics";

// Recursive component rendering the toc tree
function TOCItemTree({
	toc,
	className,
	linkClassName,
	isChild,
}: Props): JSX.Element | null {
	const onClick = useCallback((heading) => {
		trackButtonClick("button_toc_item", "v1", {
			headingId: heading.id,
			headingName: heading.value,
		});
	}, []);
	if (!toc.length) {
		return null;
	}
	return (
		<ul className={isChild ? undefined : className}>
			{toc.map((heading) => (
				<li key={heading.id}>
					<Link
						to={`#${heading.id}`}
						className={linkClassName ?? undefined}
						onClick={() => onClick(heading)}
						// Developer provided the HTML, so assume it's safe.
						dangerouslySetInnerHTML={{ __html: heading.value }}
					/>
					<TOCItemTree
						isChild
						toc={heading.children}
						className={className}
						linkClassName={linkClassName}
					/>
				</li>
			))}
		</ul>
	);
}

// Memo only the tree root is enough
export default React.memo(TOCItemTree);
