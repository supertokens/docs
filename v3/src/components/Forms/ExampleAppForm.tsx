import { useCallback, useContext, useMemo, useState } from "react";
import { DocItemContext } from "../DocItemContext";
import * as Form from "@radix-ui/react-form";
import { Select } from "@radix-ui/themes";
import BrowserOnly from "@docusaurus/BrowserOnly";
import {
	Grid,
	Text,
	Box,
	Heading,
	Flex,
	Card,
	TextField,
	VisuallyHidden,
	Separator,
} from "@radix-ui/themes";
import CodeBlock from "@theme/CodeBlock";
import { useLocation } from "@docusaurus/router";

import "./ExampleAppForm.scss";

function ExampleAppFormRoot() {
	const { search } = useLocation();
	const queryRecipe = useMemo(() => {
		const searchParams = new URLSearchParams(location.search);
		return searchParams.get("recipe") || null;
	}, [search]);
	const { appInfo, onChangeAppInfoField } = useContext(DocItemContext);
	const [frontendFramework, setFrontendFramework] = useState(null);
	const [backendLanguage, setBackendLanguage] = useState(null);
	const [recipe, setRecipe] = useState(queryRecipe);

	const onChangeInputValue = useCallback(
		(e) => {
			onChangeAppInfoField(e.target.name, e.target.value);
		},
		[onChangeAppInfoField],
	);
	const appName = appInfo.appName;

	const command = useMemo(() => {
		let baseCommand = `npx create-supertokens-app`;
		if (appName) {
			baseCommand += ` --appname=${appName}`;
		}
		if (recipe) {
			baseCommand += ` --recipe=${recipe}`;
		}
		if (frontendFramework) {
			baseCommand += ` --frontend=${frontendFramework}`;
		}
		if (backendLanguage && frontendFramework !== "next") {
			baseCommand += ` --backend=${backendLanguage}`;
		}

		return baseCommand;
	}, [recipe, frontendFramework, backendLanguage, appName]);

	return (
		<Card style={{ padding: "0" }} mb="4">
			<Form.Root asChild>
				<Flex gap="2" direction="column" px="4" pt="5" pb="0">
					<Heading as="h3" size="5" style={{ marginBottom: "0" }}>
						Generate Example App
					</Heading>
					<Text color="gray">
						Update the form based on your tech stack and requirements. Once
						you're done, copy the command and run it in your terminal.
					</Text>
					<Grid columns="repeat(2, 1fr)" mt="2" gap="4">
						<Form.Field name="appName" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text color="gray" weight="bold">
										Application Name
									</Text>
								</Form.Label>
								<VisuallyHidden>
									<Text as="span">
										This is the URL of your app's API server.
									</Text>
								</VisuallyHidden>
								<Form.Control asChild>
									<TextField.Root
										name="appName"
										placeholder="e.g. My awsome app"
										defaultValue={appInfo.appName}
										onChange={onChangeInputValue}
									/>
								</Form.Control>
							</Flex>
						</Form.Field>
						<Form.Field name="recipe" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text color="gray" weight="bold">
										Authentication Recipe
									</Text>
								</Form.Label>
								<Form.Control asChild>
									<Select.Root value={recipe} onValueChange={setRecipe}>
										<Select.Trigger />
										<Select.Content>
											<Select.Item value="emailpassword">
												Email/Password
											</Select.Item>
											<Select.Item value="passwordless">
												Passwordless
											</Select.Item>
											<Select.Item value="thirdparty">Third Party</Select.Item>
											<Select.Item value="multifactorauth">
												Multi-Factory Authentication
											</Select.Item>
											<Select.Item value="multitenancy">
												Multi-Tenancy
											</Select.Item>
										</Select.Content>
									</Select.Root>
								</Form.Control>
							</Flex>
						</Form.Field>
					</Grid>
					<Grid columns="repeat(2, 1fr)" gap="4">
						<Form.Field name="frontendFramework" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text color="gray" weight="bold">
										Frontend Framework
									</Text>
								</Form.Label>
								<Form.Control asChild>
									<Select.Root
										value={frontendFramework}
										onValueChange={setFrontendFramework}
									>
										<Select.Trigger />
										<Select.Content>
											<Select.Item value="react">React</Select.Item>
											<Select.Item value="angular">Angular</Select.Item>
											<Select.Item value="vue">Vue</Select.Item>
											<Select.Item value="next">NextJS</Select.Item>
										</Select.Content>
									</Select.Root>
								</Form.Control>
							</Flex>
						</Form.Field>
						<Form.Field name="backendLanguage" asChild>
							<Flex gap="1" direction="column">
								<Form.Label>
									<Text color="gray" weight="bold">
										Backend Language
									</Text>
								</Form.Label>
								<Form.Control asChild>
									<Select.Root
										value={backendLanguage}
										onValueChange={setBackendLanguage}
										disabled={frontendFramework === "next"}
									>
										<Select.Trigger />
										<Select.Content>
											<Select.Item value="node">NodeJS</Select.Item>
											<Select.Item value="go">Go</Select.Item>
											<Select.Item value="python">Python</Select.Item>
										</Select.Content>
									</Select.Root>
								</Form.Control>
							</Flex>
						</Form.Field>
					</Grid>
				</Flex>
			</Form.Root>
			<Separator size="4" mb="1" mt="5" />
			<CodeBlock language="bash" className="example-app-form-code-block">
				{command}
			</CodeBlock>
		</Card>
	);
}

export function ExampleAppForm(props) {
	return (
		<BrowserOnly>
			{() => {
				return <ExampleAppFormRoot {...props} />;
			}}
		</BrowserOnly>
	);
}
