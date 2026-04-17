import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fonts } from "@/constants/Typography";

export default function TabLayout() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.borderLight,
          borderTopWidth: 1,
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
          height: 60 + (insets.bottom || 8),
        },
        tabBarLabelStyle: {
          fontFamily: Fonts.medium,
          fontSize: 11,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Download",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="download" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="time" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
