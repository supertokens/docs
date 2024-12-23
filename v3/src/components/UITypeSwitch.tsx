import React, { useCallback, useContext, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { DocItemContext } from "./DocItemContext";
import { Card, Flex, Heading, RadioCards, Text } from "@radix-ui/themes";
import BrowserOnly from "@docusaurus/BrowserOnly";
import { AnimatePresence, motion } from "motion/react";
import { TOC_UI_TYPE_SWITCH_ID } from "../lib";

import "./RadioCard.scss";

function UITypeSwitch({}) {
	const { uiType, onChangeUIType } = useContext(DocItemContext);
	const { visibilityRef, isVisible } = useIsVisible();

	return (
		<Flex
			ref={visibilityRef}
			gap="2"
			direction="column"
			mb="6"
			py="5"
			px="4"
			asChild
		>
			<Card>
				<Heading as="h3" size="5">
					What type of UI are you using?
				</Heading>
				<Flex direction="row" gap="2" align="start">
					<RadioCards.Root value={uiType} columns={{ initial: "1", sm: "2" }}>
						<RadioCards.Item
							value="prebuilt"
							className="radio-card-item"
							onClick={() => onChangeUIType("prebuilt")}
						>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Pre-Built UI</Text>
								<Text>Authentication UI provided by SuperTokens</Text>
							</Flex>
						</RadioCards.Item>
						<RadioCards.Item
							value="custom"
							className="radio-card-item"
							onClick={() => onChangeUIType("custom")}
						>
							<Flex direction="column" width="100%" height="100%" align="start">
								<Text weight="bold">Custom UI</Text>
								<Text>Authentication UI created by you</Text>
							</Flex>
						</RadioCards.Item>
					</RadioCards.Root>
				</Flex>
				<BrowserOnly>
					{() => <TOCSwitch isParentVisible={isVisible} />}
				</BrowserOnly>
			</Card>
		</Flex>
	);
}

function TOCSwitch({ isParentVisible }: { isParentVisible: boolean }) {
	const { uiType, onChangeUIType } = useContext(DocItemContext);
	const root = document.getElementById(TOC_UI_TYPE_SWITCH_ID);
	const elementRef = useRef<HTMLDivElement>(null);
	if (!root) return null;
	return ReactDOM.createPortal(
		<AnimatePresence>
			{!isParentVisible && (
				<motion.div
					initial={{ opacity: 0, marginTop: -150 }}
					animate={{ opacity: 1, marginTop: 0 }}
					// Use a lower margin value to fake a full slide animation on the toc menu
					exit={{ opacity: 0, marginTop: -180 }}
				>
					<Flex
						ref={elementRef}
						gap="2"
						direction="column"
						mb="3"
						py="3"
						px="3"
						asChild
					>
						<Card>
							<Heading as="h3" size="5">
								UI Type
							</Heading>
							<RadioCards.Root defaultValue={uiType} columns="1" gap="2">
								<RadioCards.Item
									value="prebuilt"
									className="radio-card-item"
									onClick={() => onChangeUIType("prebuilt")}
								>
									<Flex
										direction="column"
										width="100%"
										height="100%"
										align="start"
									>
										<Text weight="bold">Pre-Built</Text>
									</Flex>
								</RadioCards.Item>
								<RadioCards.Item
									value="custom"
									className="radio-card-item"
									onClick={() => onChangeUIType("custom")}
								>
									<Flex
										direction="column"
										width="100%"
										height="100%"
										align="start"
									>
										<Text weight="bold">Custom</Text>
									</Flex>
								</RadioCards.Item>
							</RadioCards.Root>
						</Card>
					</Flex>
				</motion.div>
			)}
		</AnimatePresence>,
		root,
	);
}

function HeadingFilter({
	children,
	name,
}: React.PropsWithChildren<{ name: string }>) {
	return <div data-heading-filter={name}>{children}</div>;
}

function PrebuiltUIContent({ children }: React.PropsWithChildren<{}>) {
	const state = useContext(DocItemContext);

	return (
		<HeadingFilter name="prebuilt">
			{state.uiType === "prebuilt" ? children : null}
		</HeadingFilter>
	);
}

function CustomUIContent({ children }: React.PropsWithChildren<{}>) {
	const state = useContext(DocItemContext);

	return (
		<HeadingFilter name="custom">
			{state.uiType === "custom" ? children : null}
		</HeadingFilter>
	);
}

export const UIType = {
	Switch: UITypeSwitch,
	PrebuiltUIContent,
	CustomUIContent,
};

function useIsVisible() {
	const [isVisible, setIsVisible] = React.useState(false);
	const elementRef = React.useRef<HTMLDivElement>(null);
	React.useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				const visible = entry.isIntersecting;
				setIsVisible(visible);
			},
			{
				threshold: 0.3,
			},
		);

		if (elementRef.current) {
			observer.observe(elementRef.current);
		}
		return () => {
			if (elementRef.current) {
				observer.unobserve(elementRef.current);
			}
		};
	}, [elementRef]);
	return { visibilityRef: elementRef, isVisible };
}
