import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const DEFAULT_STORAGE_KEY = "ui-theme";

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = DEFAULT_STORAGE_KEY,
}: ThemeProviderProps) {
  // Initialize theme in a SSR-safe way.
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey) as Theme | null;
      return stored || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  // Setter that persists to localStorage and updates state.
  const setTheme = (next: Theme) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, next);
      }
    } catch {
      // ignore localStorage errors
    }
    setThemeState(next);
  };

  // Apply the theme to the document root.
  useEffect(() => {
    const root = window.document.documentElement;

    const applyClass = (cls: "light" | "dark") => {
      root.classList.remove("light", "dark");
      root.classList.add(cls);
    };

    if (theme === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const systemTheme = mq.matches ? "dark" : "light";
      applyClass(systemTheme);

      const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
        // Some browsers call the listener with MediaQueryListEvent and some with MediaQueryList
        const matches =
          "matches" in e
            ? (e as MediaQueryListEvent).matches
            : (e as MediaQueryList).matches;
        applyClass(matches ? "dark" : "light");
      };

      // Prefer addEventListener but fallback to addListener for older browsers.
      if (typeof mq.addEventListener === "function") {
        // Modern browsers
        // @ts-ignore - types are okay at runtime
        mq.addEventListener("change", handleChange);
        return () => {
          // @ts-ignore
          mq.removeEventListener("change", handleChange);
        };
      } else if (typeof mq.addListener === "function") {
        mq.addListener(handleChange as any);
        return () => {
          mq.removeListener(handleChange as any);
        };
      } else {
        // No listener support; nothing to cleanup
        return;
      }
    }

    // Non-system: apply chosen theme
    applyClass(theme === "dark" ? "dark" : "light");
    return;
  }, [theme]);

  const value: ThemeProviderState = {
    theme,
    setTheme,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
