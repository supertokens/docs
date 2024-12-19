import { Text } from "@radix-ui/themes";

export function DescriptionText({ children }: React.PropsWithChildren<{}>) {
	return (
		<Text asChild color="gray">
			{children}
		</Text>
	);
}
