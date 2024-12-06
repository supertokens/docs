import React, { createContext, useCallback } from "react";
import { DocsItemStateType, useDocsItemStore } from "./DocItemStore";

type DocItemContextType = DocsItemStateType & {
	onChangeUIType: (type: DocsItemStateType["uiType"]) => void;
	onChangeTenantType: (type: DocsItemStateType["tenantType"]) => void;
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

	return (
		<DocItemContext.Provider
			value={{
				...state,
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
