import { createContext } from "react";

type TabItem = { value: string; label: string };
type TabsContextType = {
  tabItems: TabItem[];
};

export const TabsContext = createContext({} as TabsContextType);

export const TabsContextProvider = ({
  tabItems,
  children,
}: React.PropsWithChildren<{ tabItems: TabItem[] }>) => {
  return (
    <TabsContext.Provider value={{ tabItems }}>{children}</TabsContext.Provider>
  );
};
