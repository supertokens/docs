import React, { createContext, useCallback, useEffect, useMemo } from "react";
import { DocsItemStateType, useDocsItemStore } from "./DocItemStore";
import { getWebJsURI } from "@site/src/lib/api";

type DocItemContextType = DocsItemStateType & {
	derived: Record<string, unknown>;
	webJsVersions: Record<string, string>;
	onChangeUIType: (type: DocsItemStateType["uiType"]) => void;
	onChangeTenantType: (type: DocsItemStateType["tenantType"]) => void;
	onChangeAppType: (type: DocsItemStateType["tenantType"]) => void;
	onChangeRecipeProperty: (
		recipeName: keyof DocsItemStateType["recipes"],
		propertyName: string,
		propertyValue: unknown,
	) => void;
	onChangeAppInfoField: (fieldName: string, value: string) => void;
};

export const DocItemContext = createContext<DocItemContextType>(
	{} as DocItemContextType,
);

export function DocItemContextProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, setState] = useDocsItemStore();
	const [webJsVersions, setWebJsVersions] = React.useState<
		Record<string, string>
	>({});

	const onLoadWebJsVersions = useCallback(async () => {
		const result = await getWebJsURI();
		setWebJsVersions(result.uri);
	}, []);
	useEffect(() => {
		onLoadWebJsVersions();
	}, []);

	const onChangeUIType = useCallback(
		(type: DocsItemStateType["uiType"]) => {
			setState({
				...state,
				uiType: type,
			});
		},
		[state],
	);

	const onChangeTenantType = useCallback(
		(type: DocsItemStateType["tenantType"]) => {
			setState({
				...state,
				tenantType: type,
			});
		},
		[state],
	);

	const onChangeAppType = useCallback(
		(type: DocsItemStateType["appType"]) => {
			setState({
				...state,
				appType: type,
			});
		},
		[state],
	);

	const onChangeAppInfoField = useCallback(
		(fieldName: string, value: string) => {
			setState({
				...state,
				appInfo: {
					...state.appInfo,
					[fieldName]: value,
				},
			});
		},
		[state],
	);

	const onChangeRecipeProperty = useCallback(
		(
			recipeName: keyof DocsItemStateType["recipes"],
			propertyName: string,
			propertyValue: unknown,
		) => {
			setState({
				...state,
				recipes: {
					...state.recipes,
					[recipeName]: {
						...state.recipes[recipeName],
						[propertyName]: propertyValue,
					},
				},
			});
		},
		[state],
	);

	const derivedState = useMemo(() => {
		let pythonContactMethodImport =
			"from supertokens_python.recipe.passwordless import ContactEmailOnlyConfig";
		let pythonContactMethodMethod = "ContactEmailOnlyConfig";
		let goPasswordlessContactMethodMethod = "ContactMethodEmailConfig";
		if (state.recipes?.passwordless?.contactMethod === "PHONE") {
			pythonContactMethodImport =
				"from supertokens_python.recipe.passwordless import ContactPhoneOnlyConfig";
			pythonContactMethodMethod = "ContactPhoneOnlyConfig";
			goPasswordlessContactMethodMethod = "ContactMethodPhoneConfig";
		} else if (
			state.recipes?.passwordless?.contactMethod === "EMAIL_OR_PHONE"
		) {
			pythonContactMethodImport =
				"from supertokens_python.recipe.passwordless import ContactEmailOrPhoneConfig";
			pythonContactMethodMethod = "ContactEmailOrPhoneConfig";
			goPasswordlessContactMethodMethod = "ContactMethodEmailOrPhoneConfig";
		}
		return {
			appIdPathname: state.appType === "single" ? "" : `/appid-<APP_ID>`,
			pythonContactMethodImport,
			pythonContactMethodMethod,
			goPasswordlessContactMethodMethod,
		};
	}, [state]);

	const coreUri = useMemo(() => {
		return state.appType === "single"
			? state.coreInfo.uri
			: `${state.coreInfo.uri}/appid-<APP_ID>`;
	}, [state]);

	return (
		<DocItemContext.Provider
			value={{
				...state,
				webJsVersions,
				coreInfo: {
					...state.coreInfo,
					uri: coreUri,
				},
				derived: derivedState,
				onChangeAppType,
				onChangeUIType,
				onChangeTenantType,
				onChangeRecipeProperty,
				onChangeAppInfoField,
			}}
		>
			{children}
		</DocItemContext.Provider>
	);
}
