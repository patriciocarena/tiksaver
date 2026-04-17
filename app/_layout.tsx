import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { FontMap } from "@/constants/Typography";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/toast-provider";
import { useAppStore } from "@/store/useAppStore";
import {
  ThemeProvider as NavigationThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";

SplashScreen.preventAutoHideAsync();

const TikSaveDark = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#FF0050",
    background: "#000000",
    card: "#0A0A0A",
    text: "#FFFFFF",
    border: "#2C2C2E",
    notification: "#FF0050",
  },
};

const TikSaveLight = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FF0050",
    background: "#F2F2F7",
    card: "#FFFFFF",
    text: "#000000",
    border: "#D1D1D6",
    notification: "#FF0050",
  },
};

export default function RootLayout() {
  const [loaded, error] = useFonts(FontMap);
  const theme = useAppStore((s) => s.preferences.theme);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider
        value={theme === "dark" ? TikSaveDark : TikSaveLight}
      >
        <ToastProvider>
          <StatusBar style={theme === "dark" ? "light" : "dark"} />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ToastProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
