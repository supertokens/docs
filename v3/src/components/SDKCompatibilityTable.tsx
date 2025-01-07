import React, { useEffect, useMemo, useState } from "react";
import {
	getCompatibility,
	getSupportedDrivers,
	getSupportedFrontends,
} from "../lib/api";
import {
	Text,
	ScrollArea,
	Skeleton,
	Badge,
	Card,
	Flex,
	Separator,
	Grid,
	Select,
	Heading,
	Box,
} from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

export function SDKCompatibilityTable() {
	const [selectedFrontendSDK, setSelectedFrontendSDK] = useState<string>("");
	const [selectedBackendSDK, setSelectedBackendSDK] = useState<string>("");
	const [selectedCoreVersion, setSelectedCoreVersion] = useState<string>("");
	const [selectedBackendSDKVersion, setSelectedBackendSDKVersion] =
		useState<string>("");
	const {
		data: supportedFrontends,
		isLoading: isFetchSupportedFrontendsLoading,
		error: fetchSupportedFrontendsError,
	} = useFetchSupportedFrontends();
	const {
		data: supportedBackends,
		isLoading: isFetchSupportedBackendsLoading,
		error: fetchSupportedBackendsError,
	} = useFetchSupportedBackends();
	const {
		data: sdkCompatibility,
		isLoading: isFetchSdkCompatibilityLoading,
		error: fetchSdkCompatibilityError,
	} = useFetchSdkCompatibility(selectedFrontendSDK, selectedBackendSDK);

	const coreVersions = useMemo(() => {
		if (!sdkCompatibility) return [];
		return Object.keys(sdkCompatibility.coreToDriver).map((version) => {
			return {
				id: version,
				displayName: `${version}.X`,
			};
		});
	}, [sdkCompatibility]);

	const backendVersions = useMemo(() => {
		if (!sdkCompatibility) return [];
		return Object.keys(sdkCompatibility.driverToFrontend).map((version) => {
			return {
				id: version,
				displayName: `${version}.X`,
			};
		});
	}, [sdkCompatibility]);

	const supportedFrontendVersions = useMemo(() => {
		if (!sdkCompatibility || !selectedBackendSDKVersion) return null;
		return sdkCompatibility.driverToFrontend[selectedBackendSDKVersion];
	}, [sdkCompatibility, selectedBackendSDKVersion]);

	const supportedBackendVersions = useMemo(() => {
		if (!sdkCompatibility || !selectedCoreVersion) return null;
		return sdkCompatibility.coreToDriver[selectedCoreVersion];
	}, [selectedCoreVersion, sdkCompatibility]);

	return (
		<>
			<Box px="5" py="5" asChild>
				<Card>
					<Form.Root asChild>
						<Flex gap="2" direction="column">
							<Box mb="2" asChild>
								<Heading as="h3" size="5">
									SDK Compatibility
								</Heading>
							</Box>
							<Text color="gray">
								Select the SDKs that you are using in order to load the
								available versions.
							</Text>
							<Separator size="4" mt="3" mb="1" />
							<Grid columns="repeat(2, 1fr)" gap="4" mt="2">
								<Form.Field name="backend-sdk" asChild>
									<Flex gap="1" direction="column">
										<Form.Label>
											<Text weight="bold" color="gray">
												Backend SDK
											</Text>
										</Form.Label>
										<Form.Control asChild>
											<Select.Root
												value={selectedBackendSDK}
												onValueChange={setSelectedBackendSDK}
												disabled={isFetchSupportedBackendsLoading}
											>
												<Select.Trigger placeholder="Your backend SDK" />
												<Select.Content>
													{supportedBackends?.drivers?.map((option) => (
														<Select.Item
															key={`selected-backend-${option.id}`}
															value={option.id}
														>
															{option.displayName}
														</Select.Item>
													))}
												</Select.Content>
											</Select.Root>
										</Form.Control>
									</Flex>
								</Form.Field>
								<Form.Field name="frontend-sdk" asChild>
									<Flex gap="1" direction="column">
										<Form.Label>
											<Text weight="bold" color="gray">
												Frontend SDK
											</Text>
										</Form.Label>
										<Form.Control asChild>
											<Select.Root
												value={selectedFrontendSDK}
												onValueChange={setSelectedFrontendSDK}
												disabled={isFetchSupportedFrontendsLoading}
											>
												<Select.Trigger placeholder="Your frontend SDK" />
												<Select.Content>
													{supportedFrontends?.frontends?.map((option) => (
														<Select.Item
															key={`selected-frontend-${option.id}`}
															value={option.id}
														>
															{option.displayName}
														</Select.Item>
													))}
												</Select.Content>
											</Select.Root>
										</Form.Control>
									</Flex>
								</Form.Field>
							</Grid>
						</Flex>
					</Form.Root>
				</Card>
			</Box>

			<Grid columns="repeat(2, 1fr)" gap="4" mt="5">
				<Box px="5" py="5" asChild>
					<Form.Root asChild>
						<ScrollArea
							type="auto"
							scrollbars="vertical"
							style={{ height: 500 }}
							asChild
						>
							<Card>
								<Flex gap="2" direction="column" style={{ height: "100%" }}>
									<Box mb="1" asChild>
										<Heading as="h3" size="3" color="orange">
											Compatible Backend SDK Versions
										</Heading>
									</Box>
									<Form.Field name="core-version" asChild>
										<Flex gap="1" direction="column">
											<Form.Label>
												<Text weight="bold" color="gray">
													SuperTokens Core Version
												</Text>
											</Form.Label>
											<Form.Control asChild>
												<Select.Root
													value={selectedCoreVersion}
													onValueChange={setSelectedCoreVersion}
													disabled={!sdkCompatibility}
												>
													<Select.Trigger />
													<Select.Content>
														{coreVersions?.map((option) => (
															<Select.Item
																key={`core-option-${option.id}`}
																value={option.id}
															>
																{option.displayName}
															</Select.Item>
														))}
													</Select.Content>
												</Select.Root>
											</Form.Control>
										</Flex>
									</Form.Field>
									<Separator size="4" mt="2" mb="3" />
									{supportedBackendVersions &&
									supportedBackendVersions.length > 0 ? (
										<Flex gap="2" direction="row" wrap="wrap">
											{supportedBackendVersions.map((version) => (
												<Badge
													key={`backend-version-${version}`}
													color="gray"
													variant="outline"
													size="3"
												>
													{version}
												</Badge>
											))}
										</Flex>
									) : null}
									{supportedBackendVersions &&
									supportedBackendVersions.length === 0 ? (
										<Flex align="center" justify="center" flexGrow="1">
											<Text color="gray" size="4">
												No compatible versions found
											</Text>
										</Flex>
									) : null}
									{sdkCompatibility && !selectedCoreVersion ? (
										<Flex align="center" justify="center" flexGrow="1">
											<Text color="gray" size="4">
												Select a supertokens-core version
											</Text>
										</Flex>
									) : null}
									{!sdkCompatibility && isFetchSdkCompatibilityLoading ? (
										<Flex align="center" justify="center" flexGrow="1">
											<Skeleton height="100%" width="100%" />
										</Flex>
									) : null}
								</Flex>
							</Card>
						</ScrollArea>
					</Form.Root>
				</Box>

				<Box px="5" py="5" asChild>
					<Form.Root asChild>
						<ScrollArea
							type="auto"
							scrollbars="vertical"
							style={{ height: 500 }}
							asChild
						>
							<Card style={{ height: "500px" }}>
								<Flex
									gap="2"
									direction="column"
									wrap="wrap"
									style={{ height: "100%" }}
								>
									<Box mb="1" asChild>
										<Heading as="h3" size="3" color="orange">
											Compatible Frontend SDK Versions
										</Heading>
									</Box>
									<Form.Field name="core-version" asChild>
										<Flex gap="1" direction="column">
											<Form.Label>
												<Text weight="bold" color="gray">
													Backend SDK Version
												</Text>
											</Form.Label>
											<Form.Control asChild>
												<Select.Root
													value={selectedBackendSDKVersion}
													onValueChange={setSelectedBackendSDKVersion}
													disabled={!sdkCompatibility}
												>
													<Select.Trigger />
													<Select.Content>
														{backendVersions?.map((option) => (
															<Select.Item
																key={`backend-version-option-${option.id}`}
																value={option.id}
															>
																{option.displayName}
															</Select.Item>
														))}
													</Select.Content>
												</Select.Root>
											</Form.Control>
										</Flex>
									</Form.Field>
									<Separator size="4" mt="2" mb="3" />
									{supportedFrontendVersions &&
									supportedFrontendVersions.length > 0 ? (
										<Flex gap="2" direction="row" wrap="wrap">
											{supportedFrontendVersions.map((version) => (
												<Badge
													key={`frontend-version-${version}`}
													color="gray"
													variant="outline"
													size="3"
												>
													{version}
												</Badge>
											))}
										</Flex>
									) : null}
									{supportedFrontendVersions &&
									supportedFrontendVersions.length === 0 ? (
										<Flex align="center" justify="center" flexGrow="1">
											<Text color="gray" size="4">
												No compatible versions found
											</Text>
										</Flex>
									) : null}
									{sdkCompatibility && !selectedBackendSDKVersion ? (
										<Flex align="center" justify="center" flexGrow="1">
											<Text color="gray" size="4">
												Select a backend SDK version
											</Text>
										</Flex>
									) : null}
									{!sdkCompatibility && isFetchSdkCompatibilityLoading ? (
										<Flex align="center" justify="center" flexGrow="1">
											<Skeleton height="100%" width="100%" />
										</Flex>
									) : null}
								</Flex>
							</Card>
						</ScrollArea>
					</Form.Root>
				</Box>
			</Grid>
		</>
	);
}

function useFetchSupportedFrontends() {
	const [data, setData] = useState<Awaited<
		ReturnType<typeof getSupportedFrontends>
	> | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await getSupportedFrontends();
				setData(response);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return { isLoading, error, data };
}

function useFetchSupportedBackends() {
	const [data, setData] = useState<Awaited<
		ReturnType<typeof getSupportedDrivers>
	> | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await getSupportedDrivers();
				setData(response);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return { data, isLoading, error };
}

function useFetchSdkCompatibility(
	selectedFrontend: string,
	selectedBackend: string,
) {
	const [data, setData] = useState<Awaited<
		ReturnType<typeof getCompatibility>
	> | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<any>(null);

	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			try {
				const response = await getCompatibility(
					selectedBackend,
					selectedFrontend,
				);
				setData(response);
			} catch (err) {
				setError(err);
			} finally {
				setIsLoading(false);
			}
		};

		if (!selectedFrontend || !selectedBackend) return;

		fetchData();
	}, [selectedFrontend, selectedBackend]);

	return { data, isLoading, error };
}
