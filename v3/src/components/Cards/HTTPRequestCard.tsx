import {
	Flex,
	Select,
	Box,
	Heading,
	SegmentedControl,
	Code,
	Card,
	Button,
	Text,
	Separator,
	ScrollArea,
} from "@radix-ui/themes";
import CodeBlock from "@theme/CodeBlock";
import { AppTypeSelect } from "/src/components/Select";
import { createContext, useContext, useState } from "react";
import { SideModal } from "../Modal";

import InfoIcon from "/img/icons/info.svg";
import { OpenAPIDocument } from "@site/src/lib/types";

type HTTPRequestContextType = {
	environment: "shell" | "nodejs" | "python" | "go";
	path: string;
	method: "post" | "get" | "put" | "delete" | "patch" | "head" | "options";
	title: string;
	isDetailsModalOpen: boolean;
};

const HTTPRequestCardContext = createContext<HTTPRequestContextType>(
	{} as HTTPRequestContextType,
);

function HTTPRequestCardRoot({
	path,
	method,
	title,
	children,
}: {
	path: string;
	method: HTTPRequestContextType["method"];
	title: string;
	children: React.ReactNode;
}) {
	const [selectedEnvironment, setSelectedEnvironment] =
		useState<HTTPRequestContextType["environment"]>("shell");
	const [showRequestDetails, setShowRequestDetails] = useState(false);

	// if (!Requests.paths[path] || !Requests.paths[path][method]) {
	// 	throw new Error(
	// 		`Could not find request for path ${path} and method ${method}`,
	// 	);
	// }
	//
	return (
		<HTTPRequestCardContext.Provider
			value={{
				environment: selectedEnvironment,
				path,
				method,
				title,
				isDetailsModalOpen: showRequestDetails,
			}}
		>
			<SideModal.Root
				open={showRequestDetails}
				onOpenChange={setShowRequestDetails}
			>
				<Box p="0" asChild>
					<Card mb="4">
						<Flex direction="row" pt="4" pb="3" px="4" justify="between">
							<Flex direction="column" gap="2">
								<Heading as="h3" mb="xs" size="6">
									{title}
								</Heading>
								<Box px="1" asChild>
									<Code weight="bold" variant="ghost" color="gray" size="2">
										{method.toUpperCase()} {path}
									</Code>
								</Box>
							</Flex>

							<SideModal.Trigger>
								<Button variant="solid" color="gray" highContrast>
									<InfoIcon /> View Details
								</Button>
							</SideModal.Trigger>
						</Flex>
						<Flex px="4" direction="column" gap="4">
							<SegmentedControl.Root
								defaultValue="shell"
								value={selectedEnvironment}
								onValueChange={(value) =>
									setSelectedEnvironment(
										value as unknown as HTTPRequestContextType["environment"],
									)
								}
							>
								<SegmentedControl.Item value="shell">
									Shell
								</SegmentedControl.Item>
								<SegmentedControl.Item value="nodejs">
									NodeJS
								</SegmentedControl.Item>
								<SegmentedControl.Item value="python">
									Python
								</SegmentedControl.Item>
								<SegmentedControl.Item value="go">Go</SegmentedControl.Item>
							</SegmentedControl.Root>
							{children}
							{/* <ShellExample /> */}
							{/* <NodeJSExample /> */}
							{/* <PythonExample /> */}
							{/* <GoExample /> */}
						</Flex>
					</Card>
				</Box>
			</SideModal.Root>
		</HTTPRequestCardContext.Provider>
	);
}

function ShellExample({ children }: { children: React.ReactNode }) {
	const { environment } = useContext(HTTPRequestCardContext);

	if (environment !== "shell") return null;

	return (
		<>
			<Flex direction="row" justify="between" align="center">
				<Text color="gray" size="3" weight="bold">
					Curl Example
				</Text>
				<AppTypeSelect />
			</Flex>
			{/* <CodeBlock language="bash"> */}
			{children}
			{/* </CodeBlock> */}
		</>
	);
}

function NodeJSExample({ children }: { children: React.ReactNode }) {
	const { environment } = useContext(HTTPRequestCardContext);

	if (environment !== "nodejs") return null;

	return (
		<>
			<Flex direction="row" justify="between" align="center">
				<Text color="gray" size="3" weight="bold">
					Curl Example
				</Text>
				<AppTypeSelect />
			</Flex>
			{/* <CodeBlock language="tsx"> */}
			{children}
			{/* </CodeBlock> */}
		</>
	);
}

function PythonExample({ children }: { children: React.ReactNode }) {
	const { environment } = useContext(HTTPRequestCardContext);

	if (environment !== "python") return null;

	return (
		<>
			<Flex direction="row" justify="between" align="center">
				<Text color="gray" size="3" weight="bold">
					Curl Example
				</Text>
				<AppTypeSelect />
			</Flex>
			<CodeBlock language="bash">{children}</CodeBlock>
		</>
	);
}

function GoExample({ children }: { children: React.ReactNode }) {
	const { environment } = useContext(HTTPRequestCardContext);

	if (environment !== "go") return null;

	return (
		<>
			<Flex direction="row" justify="between" align="center">
				<Text color="gray" size="3" weight="bold">
					Curl Example
				</Text>
				<AppTypeSelect />
			</Flex>
			{/* <CodeBlock language="bash"> */}
			{children}
			{/* </CodeBlock> */}
		</>
	);
}

function DetailsModal({ children }) {
	const { title, method, path } = useContext(HTTPRequestCardContext);

	return (
		<ScrollArea type="auto" style={{ height: "100%" }}>
			<SideModal.Content style={{ paddingTop: "0", paddingBottom: "0" }}>
				<Flex
					direction="column"
					pt="6"
					style={{
						position: "sticky",
						top: 0,
						background: "var(--color-panel-solid)",
					}}
				>
					<Heading as="h1" color="orange" asChild>
						<SideModal.Title>{title}</SideModal.Title>
					</Heading>
					<Flex px="1" style={{ alignSelf: "flex-start" }} asChild>
						<Code weight="bold" variant="ghost" color="gray" size="3">
							{method.toUpperCase()} {path}
						</Code>
					</Flex>
					<Separator size="4" mt="4" />
				</Flex>
				<Flex direction="column" gap="2" flexGrow="1">
					{children}
				</Flex>
				<Flex
					direction="row"
					align="center"
					justify="end"
					pb="6"
					style={{
						position: "sticky",
						bottom: 0,
						background: "var(--color-panel-solid)",
					}}
				>
					<SideModal.Close>
						<Button variant="solid" color="gray" highContrast size="2">
							Close
						</Button>
					</SideModal.Close>
				</Flex>
			</SideModal.Content>
		</ScrollArea>
	);
}

export const HTTPRequestCard = Object.assign(HTTPRequestCardRoot, {
	ShellExample,
	NodeJSExample,
	PythonExample,
	GoExample,
	DetailsModal,
});

// TODO: Move this into a separate section in docs
const Requests: OpenAPIDocument = {
	openapi: "3.0.0",
	info: {
		title: "SuperTokens Bulk Import API",
		version: "1.0.0",
	},
	tags: [],
	paths: {
		"/bulk-import/import": {
			post: {
				description: "Add users to bulk import",
				requestBody: {
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									externalUserId: {
										type: "string",
										description:
											"The external user ID of the user to be imported",
									},
									userMetadata: {
										type: "object",
										description: "The metadata of the user to be imported",
									},
									userRoles: {
										type: "array",
										description: "The roles of the user to be imported",
										items: {
											type: "string",
										},
									},
									totpDevices: {
										type: "array",
										description: "The TOTP devices of the user to be imported",
										items: {
											type: "object",
											properties: {
												deviceName: {
													type: "string",
													description: "The name of the TOTP device",
												},
												secretKey: {
													type: "string",
													description: "The secret key of the TOTP device",
												},
												period: {
													type: "number",
													description: "The period of the TOTP device",
												},
												skew: {
													type: "number",
													description: "The skew of the TOTP device",
												},
												verified: {
													type: "boolean",
													description: "Whether the TOTP device is verified",
												},
												createdAt: {
													type: "number",
													description: "The creation time of the TOTP device",
												},
											},
											required: [
												"deviceName",
												"secretKey",
												"period",
												"skew",
												"verified",
												"createdAt",
											],
										},
									},
									loginMethods: {
										type: "array",
										description: "The login methods of the user to be imported",
										items: {
											type: "object",
											properties: {
												id: {
													type: "string",
													description: "The ID of the login method",
												},
												createdAt: {
													type: "number",
													description: "The creation time of the login method",
												},
												updatedAt: {
													type: "number",
													description: "The update time of the login method",
												},
											},
										},
									},
								},
								required: [
									"externalUserId",
									"userMetadata",
									"userRoles",
									"totpDevices",
									"loginMethods",
								],
							},
						},
					},
				},
				responses: {
					"200": {
						description: "Successfully added users to bulk import",
					},
					"400": {
						description: "Bad request",
					},
					"500": {
						description: "Internal server error",
					},
				},
			},
		},
	},
};
