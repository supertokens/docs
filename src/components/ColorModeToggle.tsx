import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../lib/themeStore";
import * as TogglePrimitive from "@radix-ui/react-toggle";

import "./ColorModeToggle.scss";

export function ColorModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <TogglePrimitive.Root
      pressed={theme === "dark"}
      onPressedChange={(pressed) => setTheme(pressed ? "dark" : "light")}
      className="color-mode-toggle"
      aria-label="Toggle theme"
      title={`Current: ${theme}`}
    >
      <Sun className={`color-mode-toggle__icon color-mode-toggle__light-icon `} />
      <Moon className={`color-mode-toggle__icon color-mode-toggle__dark-icon `} />
    </TogglePrimitive.Root>
  );
}
