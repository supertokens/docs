import { createContext, useState } from "react";

type CardContextType = { value: string; setValue: (value: string) => void };

export const CardContext = createContext({} as CardContextType);

export const CardContextProvider = ({
	children,
	defaultValue,
}: React.PropsWithChildren<{ defaultValue: string }>) => {
	const [value, setValue] = useState(defaultValue);

	return (
		<CardContext.Provider value={{ value, setValue }}>
			{children}
		</CardContext.Provider>
	);
};
