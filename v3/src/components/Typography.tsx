import { Heading } from "@radix-ui/themes";
import { forwardRef } from "react";

/**
 * This allows use to prevent headings from being
 * collected by the remark-toc plugin
 * and then placed in the page TOC.
 * Example: we don't want to show headings that
 * are used in a modal inside the TOC.
 *
 */

export const H2 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} as="h2">
		{children}
	</Heading>
));
H2.displayName = "H2";

export const H3 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} as="h3">
		{children}
	</Heading>
));

H3.displayName = "H3";

export const H4 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} as="h3">
		{children}
	</Heading>
));

H3.displayName = "H4";
