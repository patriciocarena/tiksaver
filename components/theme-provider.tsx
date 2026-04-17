import { createContext, useMemo } from "react";
import { Colors, type ThemeColors, type ThemeMode } from "@/constants/Colors";
import { useAppStore } from "@/store/useAppStore";

interface ThemeContextValue {
  theme: ThemeMode;
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  colors: Colors.dark,
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.preferences.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const setTheme = useAppStore((s) => s.setTheme);

  const value = useMemo(
    () => ({
      theme,
      colors: Colors[theme],
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
