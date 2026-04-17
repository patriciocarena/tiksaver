import { View, Text, ScrollView, Pressable, Switch, Linking } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { Fonts } from "@/constants/Typography";
import Constants from "expo-constants";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onPress?: () => void;
}

function SettingsRow({
  icon,
  iconColor,
  iconBg,
  label,
  sublabel,
  right,
  onPress,
}: SettingsRowProps) {
  const { colors } = useTheme();

  const content = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          borderCurve: "continuous",
          backgroundColor: iconBg,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{
            fontFamily: Fonts.medium,
            fontSize: 15,
            color: colors.text,
          }}
        >
          {label}
        </Text>
        {sublabel && (
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 12,
              color: colors.textTertiary,
            }}
          >
            {sublabel}
          </Text>
        )}
      </View>
      {right}
      {onPress && !right && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.textTertiary}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          backgroundColor: pressed ? colors.surfacePressed : "transparent",
          borderRadius: 14,
          borderCurve: "continuous",
        })}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

function SettingsSection({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(350)}
      style={{ gap: 6 }}
    >
      <Text
        style={{
          fontFamily: Fonts.semiBold,
          fontSize: 13,
          color: colors.textTertiary,
          textTransform: "uppercase",
          letterSpacing: 0.5,
          paddingHorizontal: 16,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <View
        style={{
          backgroundColor: colors.surfaceElevated,
          borderRadius: 16,
          borderCurve: "continuous",
          borderWidth: 1,
          borderColor: colors.borderLight,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
    </Animated.View>
  );
}

function Divider() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: 1,
        backgroundColor: colors.borderLight,
        marginLeft: 66,
      }}
    />
  );
}

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const appVersion = Constants.expoConfig?.version || "1.0.0";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: 20,
        gap: 24,
        maxWidth: 600,
        alignSelf: "center",
        width: "100%",
      }}
    >
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{ paddingTop: 8, paddingBottom: 4 }}
      >
        <Text
          style={{
            fontFamily: Fonts.bold,
            fontSize: 28,
            color: colors.text,
            letterSpacing: -0.5,
          }}
        >
          Settings
        </Text>
      </Animated.View>

      {/* Appearance */}
      <SettingsSection title="Appearance" delay={50}>
        <SettingsRow
          icon={isDark ? "moon" : "sunny"}
          iconColor={isDark ? "#BF5AF2" : "#FF9500"}
          iconBg={isDark ? "rgba(191, 90, 242, 0.15)" : "rgba(255, 149, 0, 0.15)"}
          label="Dark Mode"
          sublabel={isDark ? "Dark theme active" : "Light theme active"}
          right={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.border,
                true: colors.primary,
              }}
              thumbColor="#FFFFFF"
            />
          }
        />
      </SettingsSection>

      {/* How to use */}
      <SettingsSection title="How to Use" delay={100}>
        <View style={{ padding: 16, gap: 16 }}>
          {[
            {
              icon: "copy-outline" as const,
              color: "#FF0050",
              bg: "rgba(255, 0, 80, 0.12)",
              title: "Copy the URL",
              desc: "Open TikTok, find a video you like, and copy its share link.",
            },
            {
              icon: "clipboard-outline" as const,
              color: "#00F2EA",
              bg: "rgba(0, 242, 234, 0.12)",
              title: "Paste & Fetch",
              desc: "Paste the URL in TikSave and tap Download to fetch the video.",
            },
            {
              icon: "download-outline" as const,
              color: "#30D158",
              bg: "rgba(48, 209, 88, 0.12)",
              title: "Save Without Watermark",
              desc: "Preview the video and save it to your device watermark-free.",
            },
          ].map((step, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  backgroundColor: step.bg,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={step.icon} size={20} color={step.color} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    fontFamily: Fonts.semiBold,
                    fontSize: 14,
                    color: colors.text,
                  }}
                >
                  {step.title}
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 13,
                    color: colors.textSecondary,
                    lineHeight: 18,
                  }}
                >
                  {step.desc}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </SettingsSection>

      {/* About */}
      <SettingsSection title="About" delay={150}>
        <SettingsRow
          icon="star-outline"
          iconColor="#FFD60A"
          iconBg="rgba(255, 214, 10, 0.12)"
          label="Rate TikSave"
          sublabel="Help us improve with a review"
          onPress={() => {
            // Placeholder for app store rating
            Linking.openURL("https://apps.apple.com");
          }}
        />
        <Divider />
        <SettingsRow
          icon="share-outline"
          iconColor="#5AC8FA"
          iconBg="rgba(90, 200, 250, 0.12)"
          label="Share TikSave"
          sublabel="Tell your friends about us"
          onPress={() => {
            // Placeholder for share
          }}
        />
        <Divider />
        <SettingsRow
          icon="shield-checkmark-outline"
          iconColor="#30D158"
          iconBg="rgba(48, 209, 88, 0.12)"
          label="Privacy Policy"
          onPress={() => {
            Linking.openURL("https://example.com/privacy");
          }}
        />
        <Divider />
        <SettingsRow
          icon="information-circle-outline"
          iconColor={colors.textSecondary}
          iconBg={colors.surfacePressed}
          label="Version"
          right={
            <Text
              selectable
              style={{
                fontFamily: Fonts.regular,
                fontSize: 14,
                color: colors.textTertiary,
                fontVariant: ["tabular-nums"],
              }}
            >
              v{appVersion}
            </Text>
          }
        />
      </SettingsSection>

      {/* Footer branding */}
      <Animated.View
        entering={FadeIn.delay(250).duration(400)}
        style={{ alignItems: "center", gap: 8, paddingTop: 8 }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            borderCurve: "continuous",
            justifyContent: "center",
            alignItems: "center",
            experimental_backgroundImage:
              "linear-gradient(135deg, #FF0050 0%, #00F2EA 100%)",
            opacity: 0.5,
          }}
        >
          <Ionicons name="download" size={18} color="#FFFFFF" />
        </View>
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 12,
            color: colors.textTertiary,
          }}
        >
          TikSave v{appVersion}
        </Text>
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 11,
            color: colors.textTertiary,
            opacity: 0.6,
          }}
        >
          Download TikTok videos without watermark
        </Text>
      </Animated.View>
    </ScrollView>
  );
}
