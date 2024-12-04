import { useCallback, useContext, useMemo, useState } from "react";
import { DocItemContext } from "../DocItemContext";
import * as Form from "@radix-ui/react-form";
import {
	Grid,
	Text,
	Heading,
	Flex,
	Card,
	TextField,
	VisuallyHidden,
	Separator,
} from "@radix-ui/themes";
import "./styles.scss";

export function AppInfoForm() {
	const { appInfo, onChangeAppInfoField } = useContext(DocItemContext);

	const [formErrors, setFormErrors] = useState<
		Record<keyof typeof appInfo, string>
	>({
		appName: "",
		apiBasePath: "",
		apiDomain: "",
		websiteDomain: "",
		websiteBasePath: "",
	});

	const onChangeInputValue = useCallback(
		(e) => {
			onChangeAppInfoField(e.target.name, e.target.value);
		},
		[onChangeAppInfoField],
	);

	const onBlur = useCallback((e) => {
		// TODO: Do validation
	}, []);

	return (
		<Card style={{ padding: "0" }} mb="4">
			<Form.Root asChild>
				<Flex gap="2" direction="column" py="5" px="4">
					<Heading as="h3" size="5">
						App Info
					</Heading>
					<Text>
						Adjust these values based on the application that you are trying to
						configure. To learn more about what each field means check the{" "}
						<a href="/docs/thirdpartyemailpassword/appinfo">references page</a>.
					</Text>
					<Grid columns="repeat(2, 1fr)" gap="4">
						<Form.Field name="appName" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text weight="bold">App Name</Text>
								</Form.Label>
								<VisuallyHidden>
									<Text as="span">
										This is the URL of your app's API server.
									</Text>
								</VisuallyHidden>
								<Form.Control asChild>
									<TextField.Root
										name="appName"
										defaultValue={appInfo.appName}
										onChange={onChangeInputValue}
										onBlur={onBlur}
									/>
								</Form.Control>
							</Flex>
						</Form.Field>
					</Grid>
					<Separator size="4" my="2" />
					<Grid columns="repeat(2, 1fr)" gap="4">
						<Form.Field name="apiDomain" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text weight="bold">API Domain</Text>
								</Form.Label>
								<VisuallyHidden>
									<Text as="span">
										This is the URL of your app's API server.
									</Text>
								</VisuallyHidden>
								<Form.Control asChild>
									<TextField.Root
										name="apiDomain"
										defaultValue={appInfo.apiDomain}
										onChange={onChangeInputValue}
										onBlur={onBlur}
									/>
								</Form.Control>
							</Flex>
						</Form.Field>
						<Form.Field name="apiBasePath" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text weight="bold">API Base Path</Text>
								</Form.Label>
								<VisuallyHidden>
									<Text as="span">
										SuperTokens will expose it's APIs scoped by this base API
										path.
									</Text>
								</VisuallyHidden>
								<Form.Control asChild>
									<TextField.Root
										name="apiBasePath"
										defaultValue={appInfo.apiBasePath}
										onChange={onChangeInputValue}
										onBlur={onBlur}
									/>
								</Form.Control>
							</Flex>
						</Form.Field>
						<Form.Field name="websiteDomain" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text weight="bold">Website Domain</Text>
								</Form.Label>
								<VisuallyHidden>
									<Text as="span">This is the URL of your website.</Text>
								</VisuallyHidden>
								<Form.Control asChild>
									<TextField.Root
										name="websiteDomain"
										defaultValue={appInfo.websiteDomain}
										onChange={onChangeInputValue}
										onBlur={onBlur}
									/>
								</Form.Control>
							</Flex>
						</Form.Field>
						<Form.Field name="websiteBasePath" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text weight="bold">Website Base Path</Text>
								</Form.Label>
								<VisuallyHidden>
									<Text as="span">
										The path where the login UI will be rendered
									</Text>
								</VisuallyHidden>
								<Form.Control asChild>
									<TextField.Root
										name="websiteBasePath"
										defaultValue={appInfo.websiteBasePath}
										onChange={onChangeInputValue}
										onBlur={onBlur}
									/>
								</Form.Control>
							</Flex>
						</Form.Field>
					</Grid>
				</Flex>
			</Form.Root>
		</Card>
	);
}
