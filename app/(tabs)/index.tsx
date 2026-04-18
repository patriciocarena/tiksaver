import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  Platform,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { Fonts } from "@/constants/Typography";
import { VideoPreviewCard } from "@/components/video-preview-card";
import { FilenameModal } from "@/components/filename-modal";
import {
  isValidTikTokUrl,
  fetchVideoInfo,
  type TikTokVideoInfo,
} from "@/services/tiktok-api";
import {
  downloadAndSaveVideo,
  generateDefaultFilename,
} from "@/services/download-service";
import { useAppStore } from "@/store/useAppStore";

type ScreenState =
  | "idle"
  | "loading"
  | "preview"
  | "downloading"
  | "downloaded"
  | "error";

export default function DownloadScreen() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const addToHistory = useAppStore((s) => s.addToHistory);

  const [url, setUrl] = useState("");
  const [state, setState] = useState<ScreenState>("idle");
  const [videoInfo, setVideoInfo] = useState<TikTokVideoInfo | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilenameModal, setShowFilenameModal] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isCompact = width < 500;

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      // Use navigator.clipboard for web, expo-clipboard for native
      if (Platform.OS === "web" && navigator.clipboard) {
        const text = await navigator.clipboard.readText();
        setUrl(text);
        showToast("Pasted from clipboard", "success");
      } else {
        const Clipboard = await import("expo-clipboard");
        const text = await Clipboard.getStringAsync();
        setUrl(text);
        showToast("Pasted from clipboard", "success");
      }
    } catch {
      showToast("Could not read clipboard", "error");
    }
  }, [showToast]);

  const handleFetchVideo = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      showToast("Please enter a TikTok URL", "error");
      return;
    }

    if (!isValidTikTokUrl(trimmed)) {
      showToast("Please enter a valid TikTok URL", "error");
      setErrorMessage("Invalid TikTok URL. Please paste a link like:\nhttps://www.tiktok.com/@user/video/123456");
      setState("error");
      return;
    }

    setState("loading");
    setVideoInfo(null);
    setErrorMessage("");

    try {
      const info = await fetchVideoInfo(trimmed);
      setVideoInfo(info);
      setState("preview");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch video";
      setErrorMessage(message);
      setState("error");
      showToast("Failed to fetch video info", "error");
    }
  }, [url, showToast]);

  const handleDownload = useCallback(() => {
    if (!videoInfo) return;
    // Show the filename modal before downloading
    setShowFilenameModal(true);
  }, [videoInfo]);

  const handleConfirmDownload = useCallback(
    async (filename: string) => {
      if (!videoInfo) return;

      setShowFilenameModal(false);
      setState("downloading");

      try {
        if (!videoInfo.downloadUrl) {
          throw new Error("No download URL available");
        }

        const result = await downloadAndSaveVideo({
          url: videoInfo.downloadUrl,
          filename,
        });

        if (!result.success) {
          throw new Error(result.error || "Download failed");
        }

        // Add to history
        addToHistory({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          url: url.trim(),
          videoTitle: videoInfo.title,
          thumbnail: videoInfo.thumbnail,
          downloadDate: new Date().toISOString(),
          localPath: result.localUri || videoInfo.downloadUrl,
        });

        setState("downloaded");
        showToast("Video saved to your device!", "success");
      } catch (err) {
        setState("preview");
        const message =
          err instanceof Error ? err.message : "Download failed";
        showToast(message, "error");
      }
    },
    [videoInfo, url, addToHistory, showToast]
  );

  const handleReset = useCallback(() => {
    setUrl("");
    setVideoInfo(null);
    setState("idle");
    setErrorMessage("");
  }, []);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: isCompact ? 20 : 40,
        gap: 24,
        maxWidth: 600,
        alignSelf: "center",
        width: "100%",
      }}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
    >
      {/* Header / Logo area */}
      <Animated.View
        entering={FadeIn.duration(500)}
        style={{ alignItems: "center", gap: 8, paddingTop: 12 }}
      >
        <View
          style={{
            width: 68,
            height: 68,
            borderRadius: 20,
            borderCurve: "continuous",
            justifyContent: "center",
            alignItems: "center",
            experimental_backgroundImage:
              "linear-gradient(135deg, #FF0050 0%, #FF2D78 50%, #00F2EA 100%)",
            boxShadow: "0 4px 20px rgba(255, 0, 80, 0.3)",
          }}
        >
          <Ionicons name="download" size={32} color="#FFFFFF" />
        </View>
        <Text
          style={{
            fontFamily: Fonts.bold,
            fontSize: 28,
            color: colors.text,
            letterSpacing: -0.5,
          }}
        >
          TikSave
        </Text>
        <Text
          style={{
            fontFamily: Fonts.regular,
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: "center",
          }}
        >
          Download TikTok videos without watermark
        </Text>
      </Animated.View>

      {/* URL Input Section */}
      <Animated.View
        entering={FadeInDown.delay(100).duration(400)}
        layout={LinearTransition}
        style={{ gap: 12 }}
      >
        {/* Input field */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.inputBackground,
            borderRadius: 16,
            borderCurve: "continuous",
            borderWidth: 1,
            borderColor: state === "error" ? colors.error : colors.border,
            paddingHorizontal: 16,
            gap: 10,
          }}
        >
          <Ionicons name="link" size={18} color={colors.textTertiary} />
          <TextInput
            ref={inputRef}
            value={url}
            onChangeText={(text) => {
              setUrl(text);
              if (state === "error") {
                setState("idle");
                setErrorMessage("");
              }
            }}
            placeholder="Paste TikTok URL here..."
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            onSubmitEditing={handleFetchVideo}
            style={{
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: 15,
              color: colors.text,
              paddingVertical: 16,
            }}
          />
          {url.length > 0 && (
            <Pressable
              onPress={() => {
                setUrl("");
                if (state === "error") {
                  setState("idle");
                  setErrorMessage("");
                }
              }}
              hitSlop={8}
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.textTertiary}
              />
            </Pressable>
          )}
        </View>

        {/* Action buttons row */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          {/* Paste from Clipboard */}
          <Pressable
            onPress={handlePasteFromClipboard}
            style={({ pressed }) => ({
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              backgroundColor: pressed
                ? colors.surfacePressed
                : colors.surfaceElevated,
              borderRadius: 14,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: colors.border,
            })}
          >
            <Ionicons
              name="clipboard-outline"
              size={18}
              color={colors.secondary}
            />
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 14,
                color: colors.secondary,
              }}
            >
              Paste
            </Text>
          </Pressable>

          {/* Download / Fetch button */}
          <Pressable
            onPress={
              state === "preview" || state === "downloaded"
                ? handleReset
                : handleFetchVideo
            }
            disabled={state === "loading" || state === "downloading"}
            style={({ pressed }) => ({
              flex: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 14,
              borderCurve: "continuous",
              opacity:
                state === "loading" || state === "downloading"
                  ? 0.7
                  : pressed
                    ? 0.85
                    : 1,
              experimental_backgroundImage:
                state === "preview" || state === "downloaded"
                  ? undefined
                  : "linear-gradient(135deg, #FF0050 0%, #FF2D78 100%)",
              backgroundColor:
                state === "preview" || state === "downloaded"
                  ? colors.surfaceElevated
                  : undefined,
              borderWidth:
                state === "preview" || state === "downloaded" ? 1 : 0,
              borderColor: colors.border,
              boxShadow:
                state === "preview" || state === "downloaded"
                  ? undefined
                  : "0 4px 16px rgba(255, 0, 80, 0.25)",
            })}
          >
            {state === "loading" ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons
                name={
                  state === "preview" || state === "downloaded"
                    ? "refresh"
                    : "download"
                }
                size={18}
                color={
                  state === "preview" || state === "downloaded"
                    ? colors.text
                    : "#FFFFFF"
                }
              />
            )}
            <Text
              style={{
                fontFamily: Fonts.bold,
                fontSize: 15,
                color:
                  state === "preview" || state === "downloaded"
                    ? colors.text
                    : "#FFFFFF",
              }}
            >
              {state === "loading"
                ? "Fetching..."
                : state === "preview" || state === "downloaded"
                  ? "New Download"
                  : "Download"}
            </Text>
          </Pressable>
        </View>
      </Animated.View>

      {/* Error State */}
      {state === "error" && errorMessage && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOut.duration(200)}
          style={{
            backgroundColor: colors.errorMuted,
            borderRadius: 14,
            borderCurve: "continuous",
            padding: 16,
            flexDirection: "row",
            gap: 12,
            borderWidth: 1,
            borderColor: `${colors.error}33`,
          }}
        >
          <Ionicons name="warning" size={20} color={colors.error} />
          <Text
            selectable
            style={{
              flex: 1,
              fontFamily: Fonts.regular,
              fontSize: 14,
              color: colors.error,
              lineHeight: 20,
            }}
          >
            {errorMessage}
          </Text>
        </Animated.View>
      )}

      {/* Loading State */}
      {state === "loading" && (
        <Animated.View
          entering={FadeIn.duration(300)}
          exiting={FadeOut.duration(200)}
          style={{
            alignItems: "center",
            gap: 16,
            paddingVertical: 40,
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.primaryMuted,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
          <Text
            style={{
              fontFamily: Fonts.medium,
              fontSize: 15,
              color: colors.textSecondary,
            }}
          >
            Fetching video info...
          </Text>
        </Animated.View>
      )}

      {/* Video Preview */}
      {(state === "preview" ||
        state === "downloading" ||
        state === "downloaded") &&
        videoInfo && (
          <VideoPreviewCard
            video={videoInfo}
            onDownload={handleDownload}
            isDownloading={state === "downloading"}
            isDownloaded={state === "downloaded"}
          />
        )}

      {/* Idle state hint */}
      {state === "idle" && !url && (
        <Animated.View
          entering={FadeIn.delay(300).duration(500)}
          style={{
            alignItems: "center",
            gap: 20,
            paddingTop: 20,
          }}
        >
          <View
            style={{
              width: "100%",
              backgroundColor: colors.surfaceElevated,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 20,
              gap: 16,
              borderWidth: 1,
              borderColor: colors.borderLight,
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 15,
                color: colors.text,
              }}
            >
              How to download
            </Text>
            {[
              {
                step: "1",
                icon: "copy-outline" as const,
                text: "Copy the TikTok video link",
              },
              {
                step: "2",
                icon: "clipboard-outline" as const,
                text: "Paste it here or tap the Paste button",
              },
              {
                step: "3",
                icon: "download-outline" as const,
                text: "Tap Download and save the video",
              },
            ].map((item) => (
              <View
                key={item.step}
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    borderCurve: "continuous",
                    backgroundColor: colors.primaryMuted,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={colors.primary}
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    fontFamily: Fonts.regular,
                    fontSize: 14,
                    color: colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {item.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Supported formats */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {["tiktok.com", "vm.tiktok.com", "vt.tiktok.com"].map((domain) => (
              <View
                key={domain}
                style={{
                  backgroundColor: colors.secondaryMuted,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 8,
                  borderCurve: "continuous",
                }}
              >
                <Text
                  style={{
                    fontFamily: Fonts.medium,
                    fontSize: 12,
                    color: colors.secondary,
                  }}
                >
                  {domain}
                </Text>
              </View>
            ))}
          </View>
        </Animated.View>
      )}

      {/* Filename Modal */}
      <FilenameModal
        visible={showFilenameModal}
        defaultFilename={
          videoInfo ? generateDefaultFilename(videoInfo.title) : ""
        }
        onConfirm={handleConfirmDownload}
        onCancel={() => setShowFilenameModal(false)}
      />
    </ScrollView>
  );
}
