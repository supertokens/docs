import React from "react";
import { useLocation } from "@docusaurus/router";
import { getSelection, Selection } from "./utils";

type GuidePageContextType = {
  selection: Selection;
  showOnlySelected: boolean;
  onChangeShowOnlySelected: (showOnlySelected: boolean) => void;
};

export const GuidePageContext = React.createContext<GuidePageContextType>(
  {} as GuidePageContextType,
);

export const GuidePageContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const location = useLocation();
  const [showOnlySelected, setShowOnlySelected] = React.useState(true);

  const selection = React.useMemo(() => {
    return getSelection(location.search);
  }, [location]);

  if (!selection) {
    return null;
  }

  return (
    <GuidePageContext.Provider
      value={{
        selection,
        showOnlySelected,
        onChangeShowOnlySelected: setShowOnlySelected,
      }}
    >
      {children}
    </GuidePageContext.Provider>
  );
};

export const ToggleShowOnlySelected = () => {
  const { onChangeShowOnlySelected, showOnlySelected } =
    React.useContext(GuidePageContext);

  return (
    <button
      onClick={() => {
        onChangeShowOnlySelected(!showOnlySelected);
      }}
    >
      {showOnlySelected
        ? "Only the selection content is visible"
        : "All the possible options are visible"}
    </button>
  );
};
