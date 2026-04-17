import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { Fonts } from "@/constants/Typography";
import type { TikTokVideoInfo } from "@/services/tiktok-api";
import { formatCount, formatDuration } from "@/services/tiktok-api";

interface VideoPreviewCardProps {
  video: TikTokVideoInfo;
  onDownload: () => void;
  isDownloading: boolean;
  isDownloaded: boolean;
}

export function VideoPreviewCard({
  video,
  onDownload,
  isDownloading,
  isDownloaded,
}: VideoPreviewCardProps) {
  const { colors } = useTheme();

  return (
    <Animated.View
      entering={FadeInDown.duration(400).springify()}
      style={{
        backgroundColor: colors.surfaceElevated,
        borderRadius: 20,
        borderCurve: "continuous",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.border,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Thumbnail */}
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: video.thumbnail }}
          style={{ width: "100%", height: 220 }}
          contentFit="cover"
          transition={300}
        />
        <View
          style={{
            position: "absolute",
            inset: 0,
            experimental_backgroundImage:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
          }}
        />
        {/* Duration badge */}
        {video.duration > 0 && (
          <View
            style={{
              position: "absolute",
              bottom: 12,
              right: 12,
              backgroundColor: "rgba(0,0,0,0.7)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
              borderCurve: "continuous",
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 12,
                color: "#FFFFFF",
                fontVariant: ["tabular-nums"],
              }}
            >
              {formatDuration(video.duration)}
            </Text>
          </View>
        )}
        {/* Play icon overlay */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </View>
        </View>
      </View>

      {/* Info section */}
      <View style={{ padding: 16, gap: 12 }}>
        {/* Title */}
        <Text
          numberOfLines={2}
          selectable
          style={{
            fontFamily: Fonts.semiBold,
            fontSize: 15,
            lineHeight: 20,
            color: colors.text,
          }}
        >
          {video.title}
        </Text>

        {/* Author row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {video.authorAvatar ? (
            <Image
              source={{ uri: video.authorAvatar }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
            />
          ) : (
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: colors.primaryMuted,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="person" size={14} color={colors.primary} />
            </View>
          )}
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 13,
              color: colors.textSecondary,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {video.author}
          </Text>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: "row", gap: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="play" size={14} color={colors.textTertiary} />
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: colors.textTertiary,
                fontVariant: ["tabular-nums"],
              }}
            >
              {formatCount(video.playCount)}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="heart" size={14} color={colors.textTertiary} />
            <Text
              style={{
                fontFamily: Fonts.regular,
                fontSize: 12,
                color: colors.textTertiary,
                fontVariant: ["tabular-nums"],
              }}
            >
              {formatCount(video.likeCount)}
            </Text>
          </View>
          {video.musicTitle && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                flex: 1,
              }}
            >
              <Ionicons
                name="musical-notes"
                size={14}
                color={colors.textTertiary}
              />
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 12,
                  color: colors.textTertiary,
                  flex: 1,
                }}
              >
                {video.musicTitle}
              </Text>
            </View>
          )}
        </View>

        {/* Download / Save button */}
        <Pressable
          onPress={onDownload}
          disabled={isDownloading}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            paddingVertical: 14,
            borderRadius: 14,
            borderCurve: "continuous",
            opacity: pressed ? 0.85 : 1,
            ...(isDownloaded
              ? {
                  backgroundColor: colors.successMuted,
                  borderWidth: 1,
                  borderColor: colors.success,
                }
              : {
                  experimental_backgroundImage:
                    "linear-gradient(135deg, #FF0050 0%, #FF2D78 50%, #00F2EA 100%)",
                }),
          })}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons
              name={isDownloaded ? "checkmark-circle" : "download"}
              size={20}
              color={isDownloaded ? colors.success : "#FFFFFF"}
            />
          )}
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 15,
              color: isDownloaded ? colors.success : "#FFFFFF",
            }}
          >
            {isDownloading
              ? "Downloading..."
              : isDownloaded
                ? "Downloaded!"
                : "Save to Device"}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
