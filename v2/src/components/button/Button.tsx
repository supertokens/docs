import React from "react";

import "./Button.css";

type BaseProps = {
  type?: "primary" | "light" | "ghost";
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

type LinkButton = BaseProps & {
  as?: "a";
  href: string;
};

type ActionButton = BaseProps & {
  as?: "button";
  onClick?: () => void;
};

type ButtonProps = LinkButton | ActionButton;

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    type = "primary",
    children,
    className,
    disabled = false,
    as = "button",
  } = props;

  const buttonClassName = `st-button st-button--${type} ${className || ""}`;

  if (as === "a") {
    const typedRef = ref as React.RefObject<HTMLAnchorElement>;
    return (
      <a
        className={buttonClassName}
        // @ts-expect-error
        href={props.href}
        ref={typedRef}
      >
        {children}
      </a>
    );
  }

  const typedRef = ref as React.RefObject<HTMLButtonElement>;
  return (
    <button
      className={buttonClassName}
      ref={typedRef}
      disabled={disabled}
      // @ts-expect-error
      onClick={props.onClick}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
