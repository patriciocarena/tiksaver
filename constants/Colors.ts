export const Colors = {
  dark: {
    primary: "#FF0050",
    primaryMuted: "rgba(255, 0, 80, 0.15)",
    secondary: "#00F2EA",
    secondaryMuted: "rgba(0, 242, 234, 0.15)",
    background: "#000000",
    surface: "#111111",
    surfaceElevated: "#1A1A1A",
    surfacePressed: "#222222",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    textTertiary: "#636366",
    border: "#2C2C2E",
    borderLight: "#1C1C1E",
    success: "#30D158",
    successMuted: "rgba(48, 209, 88, 0.15)",
    error: "#FF453A",
    errorMuted: "rgba(255, 69, 58, 0.15)",
    warning: "#FFD60A",
    overlay: "rgba(0, 0, 0, 0.6)",
    tabBar: "#0A0A0A",
    inputBackground: "#1C1C1E",
  },
  light: {
    primary: "#FF0050",
    primaryMuted: "rgba(255, 0, 80, 0.08)",
    secondary: "#00C4BD",
    secondaryMuted: "rgba(0, 196, 189, 0.1)",
    background: "#F2F2F7",
    surface: "#FFFFFF",
    surfaceElevated: "#FFFFFF",
    surfacePressed: "#E5E5EA",
    text: "#000000",
    textSecondary: "#8E8E93",
    textTertiary: "#AEAEB2",
    border: "#D1D1D6",
    borderLight: "#E5E5EA",
    success: "#34C759",
    successMuted: "rgba(52, 199, 89, 0.1)",
    error: "#FF3B30",
    errorMuted: "rgba(255, 59, 48, 0.1)",
    warning: "#FF9500",
    overlay: "rgba(0, 0, 0, 0.3)",
    tabBar: "#FFFFFF",
    inputBackground: "#E5E5EA",
  },
} as const;

type ColorScheme = (typeof Colors)["dark"] | (typeof Colors)["light"];

export type ThemeColors = {
  [K in keyof (typeof Colors)["dark"]]: string;
};

export type ThemeMode = "dark" | "light";
