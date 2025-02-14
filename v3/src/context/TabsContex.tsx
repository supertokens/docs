import { createContext } from "react";

/**
 * Utility context used to trigger an error if an incorrect tab value is passed to TabItem components
 */
type TabItem = { value: string; label: string };
type TabsContextType = {
  tabValues: TabItem[];
};

export const TabsContext = createContext({} as TabsContextType);

export const TabsContextProvider = ({ tabValues, children }: React.PropsWithChildren<{ tabValues: TabItem[] }>) => {
  return <TabsContext.Provider value={{ tabValues }}>{children}</TabsContext.Provider>;
};
