import { Select } from "@radix-ui/themes";
import { useContext } from "react";

import { DocItemContext } from "../DocItemContext";

export const AppTypeSelect = () => {
	const { appType, onChangeAppType } = useContext(DocItemContext);

	return (
		<Select.Root value={appType} onValueChange={onChangeAppType}>
			<Select.Trigger variant="ghost" color="gray" mr="xs" />
			<Select.Content>
				<Select.Item value="single">Single App Setup</Select.Item>
				<Select.Item value="multi">Multi App Setup</Select.Item>
			</Select.Content>
		</Select.Root>
	);
};
