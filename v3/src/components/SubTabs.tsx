import { SegmentedControl } from "@radix-ui/themes";
import { createContext, useContext, useState } from "react";

type SubTabsContextType = {
  value: string;
  setValue: (value: string) => void;
};

const SubTabsContext = createContext({} as SubTabsContextType);

function SubTabsRoot({
  defaultValue,
  children,
}: React.PropsWithChildren<{ defaultValue: string }>) {
  const [value, setValue] = useState(defaultValue);
  return (
    <SubTabsContext.Provider value={{ value, setValue }}>
      {children}
    </SubTabsContext.Provider>
  );
}

function SubTabsList(
  props: React.ComponentProps<typeof SegmentedControl.Root>,
) {
  const { value, setValue } = useContext(SubTabsContext);

  return (
    <SegmentedControl.Root {...props} value={value} onValueChange={setValue} />
  );
}

function SubTabsContent({
  value,
  children,
}: React.PropsWithChildren<{ value: string }>) {
  const { value: contextValue } = useContext(SubTabsContext);
  if (value !== contextValue) {
    return null;
  }
  return <>{children}</>;
}

export const SubTabs = Object.assign(SubTabsRoot, {
  Content: SubTabsContent,
  List: SubTabsList,
  Tab: SegmentedControl.Item,
});
