import React, { cloneElement, useCallback, type ReactElement } from "react";
import clsx from "clsx";
import {
	useScrollPositionBlocker,
	useTabs,
	sanitizeTabsChildren,
	type TabItemProps,
} from "@docusaurus/theme-common/internal";
import useIsBrowser from "@docusaurus/useIsBrowser";
import type { Props } from "@theme/Tabs";
import { Box, Tabs as RadixTabs } from "@radix-ui/themes";

import { TabsContext, TabsContextProvider } from "@site/src/context";

import styles from "./styles.module.css";

function TabList({
	className,
	block,
	selectedValue,
	selectValue,
	tabValues,
}: Props & ReturnType<typeof useTabs>) {
	const tabRefs: (HTMLLIElement | null)[] = [];
	const { blockElementScrollPositionUntilNextRender } =
		useScrollPositionBlocker();

	const handleTabChange = (newValue: string) => {
		// const newTab = event.currentTarget;
		// const newTabIndex = tabRefs.indexOf(newTab);
		// const newTabValue = tabValues[newTabIndex]!.value;

		// if (newTabValue !== selectedValue) {
		// blockElementScrollPositionUntilNextRender(newTab);
		selectValue(newValue);
		// }
	};

	const handleKeydown = (event: React.KeyboardEvent<HTMLLIElement>) => {
		let focusElement: HTMLLIElement | null = null;

		switch (event.key) {
			case "Enter": {
				handleTabChange(event);
				break;
			}
			case "ArrowRight": {
				const nextTab = tabRefs.indexOf(event.currentTarget) + 1;
				focusElement = tabRefs[nextTab] ?? tabRefs[0]!;
				break;
			}
			case "ArrowLeft": {
				const prevTab = tabRefs.indexOf(event.currentTarget) - 1;
				focusElement = tabRefs[prevTab] ?? tabRefs[tabRefs.length - 1]!;
				break;
			}
			default:
				break;
		}

		focusElement?.focus();
	};

	return (
		// @ts-expect-error
		<TabsContextProvider tabValues={tabValues}>
			<RadixTabs.Root value={selectedValue} onValueChange={handleTabChange}>
				<RadixTabs.List>
					{tabValues.map(({ value, label, attributes }) => (
						<RadixTabs.Trigger value={value} key={value} {...attributes}>
							{label}
						</RadixTabs.Trigger>
					))}
				</RadixTabs.List>
			</RadixTabs.Root>
		</TabsContextProvider>
	);
}

function TabContent({
	lazy,
	children,
	selectedValue,
}: Props & ReturnType<typeof useTabs>) {
	const childTabs = (Array.isArray(children) ? children : [children]).filter(
		Boolean,
	) as ReactElement<TabItemProps>[];
	if (lazy) {
		const selectedTabItem = childTabs.find(
			(tabItem) => tabItem.props.value === selectedValue,
		);
		if (!selectedTabItem) {
			// fail-safe or fail-fast? not sure what's best here
			return null;
		}
		return cloneElement(selectedTabItem, {
			className: clsx("margin-top--md", selectedTabItem.props.className),
		});
	}
	return (
		<div className="margin-top--md">
			{childTabs.map((tabItem, i) =>
				cloneElement(tabItem, {
					key: i,
					hidden: tabItem.props.value !== selectedValue,
				}),
			)}
		</div>
	);
}

function TabsComponent(
	props: Props & { onChange?: (value: string) => void },
): JSX.Element {
	const { onChange, ...rest } = props;
	const tabs = useTabs(rest);
	const { selectedValue, selectValue, tabValues } = tabs;
	const onValueChange = useCallback(
		(value: string) => {
			selectValue(value);
			if (onChange) {
				onChange(value);
			}
		},
		[onChange],
	);
	return (
		// @ts-expect-error
		<TabsContextProvider tabValues={tabValues}>
			<RadixTabs.Root
				mb="6"
				value={selectedValue}
				onValueChange={onValueChange}
			>
				<RadixTabs.List
					style={{
						fontSize: "var(--font-size-4)",
						lineHeight: "var(--line-height-4)",
						letterSpacing: "var(--letter-spacing-4)",
					}}
					className={styles.tabList}
				>
					{tabValues.map(({ value, label, attributes }) => (
						<RadixTabs.Trigger value={value} key={value} {...attributes}>
							{label}
						</RadixTabs.Trigger>
					))}
				</RadixTabs.List>
				<Box pt="1">{props.children}</Box>
			</RadixTabs.Root>
		</TabsContextProvider>
	);
}

export default function Tabs(props: Props): JSX.Element {
	const isBrowser = useIsBrowser();
	return (
		<TabsComponent
			// Remount tabs after hydration
			// Temporary fix for https://github.com/facebook/docusaurus/issues/5653
			key={String(isBrowser)}
			{...props}
		>
			{props.children}
		</TabsComponent>
	);
}
