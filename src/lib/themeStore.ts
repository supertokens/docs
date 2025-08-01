import { useSyncExternalStore } from "react";

export type ColorMode = "light" | "dark";

// The color mode explicitly chosen by the user
// null => no choice has been made, or the choice has been reverted to OS value
export type ColorModeChoice = ColorMode | null;

function getSystemColorMode(): ColorMode {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function subscribeToMedia(query: string, listener: (event: MediaQueryListEvent) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(query);
  mql.addEventListener("change", listener);
  return () => mql.removeEventListener("change", listener);
}

function subscribeToSystemColorModeChange(onChange: (newSystemColorMode: ColorMode) => void): () => void {
  return subscribeToMedia("(prefers-color-scheme: dark)", () => onChange(getSystemColorMode()));
}

const ColorModeStorageKey = "theme";

const storage = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return localStorage.getItem(ColorModeStorageKey);
    } catch {
      return null;
    }
  },
  set: (value: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(ColorModeStorageKey, value);
    } catch {}
  },
  del: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ColorModeStorageKey);
    } catch {}
  },
  listen: (callback: (event: { newValue: string | null }) => void) => {
    if (typeof window === "undefined") return () => {};

    const listener = (e: StorageEvent) => {
      if (e.key === ColorModeStorageKey) {
        callback({ newValue: e.newValue });
      }
    };

    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  },
};

const DefaultColorMode: ColorMode = "dark";
// We use data-theme-choice="system", not an absent attribute
const SystemAttribute = "system";

// Ensure to always return a valid colorMode even if input is invalid
const coerceToColorMode = (colorMode: string | null): ColorMode => (colorMode === "dark" ? "dark" : "light");

const coerceToColorModeChoice = (colorMode: string | null): ColorModeChoice =>
  colorMode === null || colorMode === SystemAttribute ? null : coerceToColorMode(colorMode);

const ColorModeAttribute = {
  get: (): ColorMode => {
    if (typeof document === "undefined") return DefaultColorMode;
    return coerceToColorMode(document.documentElement.getAttribute("data-theme"));
  },
  set: (colorMode: ColorMode) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", coerceToColorMode(colorMode));
  },
};

const ColorModeChoiceAttribute = {
  get: (): ColorModeChoice => {
    if (typeof document === "undefined") return null;
    return coerceToColorModeChoice(document.documentElement.getAttribute("data-theme-choice"));
  },
  set: (colorMode: ColorModeChoice) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme-choice", coerceToColorModeChoice(colorMode) ?? SystemAttribute);
  },
};

const persistColorModeChoice = (newColorMode: ColorModeChoice) => {
  if (newColorMode === null) {
    storage.del();
  } else {
    storage.set(coerceToColorMode(newColorMode));
  }
};

interface ThemeState {
  colorMode: ColorMode;
  colorModeChoice: ColorModeChoice;
}

class ThemeStore {
  private state: ThemeState;
  private listeners = new Set<() => void>();
  private systemChangeUnsubscribe: (() => void) | null = null;
  private storageUnsubscribe: (() => void) | null = null;
  private initialized = false;

  constructor() {
    this.state = {
      colorMode: DefaultColorMode,
      colorModeChoice: null,
    };

    if (typeof window !== "undefined") {
      this.initialize();
    }
  }

  private initialize() {
    if (this.initialized) return;
    this.initialized = true;

    this.state = {
      colorMode: ColorModeAttribute.get(),
      colorModeChoice: ColorModeChoiceAttribute.get(),
    };

    this.systemChangeUnsubscribe = subscribeToSystemColorModeChange((newSystemColorMode) => {
      if (this.state.colorModeChoice === null) {
        this.updateColorMode(newSystemColorMode, this.state.colorModeChoice);
      }
    });

    // Subscribe to storage changes (for cross-tab synchronization)
    this.storageUnsubscribe = storage.listen((e) => {
      const newChoice = coerceToColorModeChoice(e.newValue);
      this.setColorMode(newChoice, false);
    });
  }

  private updateColorMode(colorMode: ColorMode, colorModeChoice: ColorModeChoice) {
    this.state = { colorMode, colorModeChoice };
    ColorModeAttribute.set(colorMode);
    ColorModeChoiceAttribute.set(colorModeChoice);
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }

  getSnapshot = (): ThemeState => {
    if (!this.initialized && typeof window !== "undefined") {
      this.initialize();
    }
    return this.state;
  };

  subscribe = (listener: () => void): (() => void) => {
    if (!this.initialized && typeof window !== "undefined") {
      this.initialize();
    }

    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  setColorMode = (newColorModeChoice: ColorModeChoice, persist = true) => {
    if (newColorModeChoice === null) {
      const newColorMode = getSystemColorMode();
      this.updateColorMode(newColorMode, null);
    } else {
      this.updateColorMode(newColorModeChoice, newColorModeChoice);
    }

    if (persist) persistColorModeChoice(newColorModeChoice);
  };

  destroy() {
    this.systemChangeUnsubscribe?.();
    this.storageUnsubscribe?.();
    this.listeners.clear();
  }
}

const themeStore = new ThemeStore();

export type ThemeOption = 'system' | 'light' | 'dark';

export function useTheme() {
  const state = useSyncExternalStore(themeStore.subscribe, themeStore.getSnapshot, () => ({
    colorMode: DefaultColorMode,
    colorModeChoice: null,
  }));

  // Convert internal state to external API
  const currentTheme: ThemeOption = state.colorModeChoice === null ? 'system' : state.colorModeChoice;
  
  const setTheme = (theme: ThemeOption) => {
    const colorModeChoice = theme === 'system' ? null : theme;
    themeStore.setColorMode(colorModeChoice);
  };

  const getNextTheme = (): ThemeOption => {
    if (currentTheme === 'system') {
      // If system, next should be opposite of current system preference
      const systemTheme = getSystemColorMode();
      return systemTheme === 'light' ? 'dark' : 'light';
    }
    if (currentTheme === 'light') return 'dark';
    return 'system'; // dark -> system
  };

  return {
    theme: state.colorMode,
    currentTheme,
    setTheme,
    getNextTheme,
  };
}

export { themeStore };

