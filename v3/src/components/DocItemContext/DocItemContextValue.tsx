import { useContext } from "react";
import { DocItemContext } from "./DocItemContext";

export function DocItemContextValue({
	propertyPath,
}: {
	propertyPath: string;
}) {
	const context = useContext(DocItemContext);

	return getContextValue(context, propertyPath);
}

export function getContextValue(
	obj: Record<string, unknown>,
	key: string,
	defaultValue?: unknown,
): unknown {
	if (!key) return "";
	if (!obj) {
		if (defaultValue) return defaultValue;
		return "";
	}
	const keys = key.split(".");
	let current = obj;

	if (keys.length === 1) {
		const value = obj[keys[0]];
		return value || defaultValue;
	}

	// @ts-expect-error
	current = current[keys[0]];
	return getContextValue(current, keys.slice(1).join("."), defaultValue);
}
