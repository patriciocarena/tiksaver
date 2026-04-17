import { View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { Fonts } from "@/constants/Typography";
import type { DownloadHistoryItem } from "@/store/types";

interface HistoryItemProps {
  item: DownloadHistoryItem;
  onDelete: (id: string) => void;
  index: number;
}

function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function HistoryItem({ item, onDelete, index }: HistoryItemProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 60).duration(300)}
      exiting={FadeOutLeft.duration(200)}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          backgroundColor: colors.surfaceElevated,
          borderRadius: 16,
          borderCurve: "continuous",
          padding: 12,
          borderWidth: 1,
          borderColor: colors.borderLight,
        }}
      >
        {/* Thumbnail */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            borderCurve: "continuous",
            overflow: "hidden",
            backgroundColor: colors.surface,
          }}
        >
          {item.thumbnail ? (
            <Image
              source={{ uri: item.thumbnail }}
              style={{ width: 72, height: 72 }}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="videocam"
                size={28}
                color={colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Text content */}
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            numberOfLines={2}
            style={{
              fontFamily: Fonts.semiBold,
              fontSize: 14,
              lineHeight: 18,
              color: colors.text,
            }}
          >
            {item.videoTitle || "TikTok Video"}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: colors.textTertiary,
              }}
            >
              {formatRelativeDate(item.downloadDate)}
            </Text>
          </View>
        </View>

        {/* Delete button */}
        <Pressable
          onPress={() => onDelete(item.id)}
          hitSlop={12}
          style={({ pressed }) => ({
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: pressed
              ? colors.errorMuted
              : colors.surfacePressed,
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </Pressable>
      </View>
    </Animated.View>
  );
}
