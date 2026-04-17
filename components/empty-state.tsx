import { View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { Fonts } from "@/constants/Typography";

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
        gap: 16,
        paddingVertical: 60,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.primaryMuted,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon} size={36} color={colors.primary} />
      </View>
      <Text
        style={{
          fontFamily: Fonts.bold,
          fontSize: 20,
          color: colors.text,
          textAlign: "center",
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontFamily: Fonts.regular,
          fontSize: 15,
          color: colors.textSecondary,
          textAlign: "center",
          lineHeight: 22,
        }}
      >
        {subtitle}
      </Text>
    </Animated.View>
  );
}
