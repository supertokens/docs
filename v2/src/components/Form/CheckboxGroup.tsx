import React, { createContext, useCallback, useContext, useMemo } from "react";

import "./CheckboxGroup.css";

type CheckboxGroupContextType = {
  checkedValues: Record<string, boolean>;
  onClickItem: (value: string) => void;
};

const CheckboxGroupContext = createContext<CheckboxGroupContextType>(
  {} as CheckboxGroupContextType,
);

function CheckboxGroupRoot({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string[];
  onChange: (value: string) => void;
}) {
  const checkedValues = useMemo(() => {
    const checkedValues: Record<string, boolean> = {};
    for (const v of value) {
      checkedValues[v] = true;
    }
    return checkedValues;
  }, [value]);

  return (
    <CheckboxGroupContext.Provider
      value={{ checkedValues, onClickItem: onChange }}
    >
      <div className="checkbox-group">{children}</div>
    </CheckboxGroupContext.Provider>
  );
}

function CheckboxGroupItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  const { checkedValues, onClickItem } = useContext(CheckboxGroupContext);
  return (
    <div
      className="checkbox-group__item"
      data-checked={checkedValues[value]}
      onClick={() => onClickItem(value)}
    >
      {children}
    </div>
  );
}

const CheckboxGroup = Object.assign(CheckboxGroupRoot, {
  Item: CheckboxGroupItem,
});

export default CheckboxGroup;
