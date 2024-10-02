import clsx from "clsx";
import React from "react";

import "./Input.css";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>((props, ref) => {
  const { className, ...rest } = props;
  return <input className={clsx("st-input", className)} ref={ref} {...rest} />;
});

export default Input;
