import { Theme } from "@radix-ui/themes";

import { DocItemContextProvider } from "../components/DocItemContext";

export default function Root({ children }: { children: React.ReactNode }) {
	return (
		<Theme
			accentColor="orange"
			grayColor="gray"
			appearance="dark"
			className="theme-root"
		>
			<DocItemContextProvider>{children}</DocItemContextProvider>
		</Theme>
	);
}
