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

export const H1 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} size="8" as="h1">
		{children}
	</Heading>
));
H1.displayName = "H1";

export const H2 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} size="7" as="h2">
		{children}
	</Heading>
));
H2.displayName = "H2";

export const H3 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} size="6" as="h3">
		{children}
	</Heading>
));

H3.displayName = "H3";

export const H4 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} as="h4" size="5">
		{children}
	</Heading>
));

H4.displayName = "H4";

export const H5 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} as="h5" size="4">
		{children}
	</Heading>
));

H5.displayName = "H5";

export const H6 = forwardRef<
	React.ElementRef<typeof Heading>,
	Omit<React.ComponentPropsWithoutRef<typeof Heading>, "as">
>(({ className, children, ...props }, ref) => (
	<Heading ref={ref} {...props} as="h6" size="2">
		{children}
	</Heading>
));

H6.displayName = "H6";
