import React, { createContext, useContext } from "react";

import "./RadioGroup.css";

type RadioGroupContextType = {
  checkedValue: string;
  onClickItem: (value: string) => void;
};

const RadioGroupContext = createContext<RadioGroupContextType>(
  {} as RadioGroupContextType,
);

function RadioGroupRoot({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <RadioGroupContext.Provider
      value={{ checkedValue: value, onClickItem: onChange }}
    >
      <div className="radio-group">{children}</div>
    </RadioGroupContext.Provider>
  );
}

function RadioGroupItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  const { checkedValue, onClickItem } = useContext(RadioGroupContext);
  return (
    <div
      className="radio-group__item"
      data-checked={checkedValue === value}
      onClick={() => onClickItem(value)}
    >
      {children}
    </div>
  );
}

const RadioGroup = Object.assign(RadioGroupRoot, {
  Item: RadioGroupItem,
});

export default RadioGroup;
