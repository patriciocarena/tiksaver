import { useCallback } from "react";
import { View, Text, ScrollView, Pressable, Alert, Platform } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { Fonts } from "@/constants/Typography";
import { useAppStore } from "@/store/useAppStore";
import { HistoryItem } from "@/components/history-item";
import { EmptyState } from "@/components/empty-state";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const { showToast } = useToast();
  const insets = useSafeAreaInsets();
  const history = useAppStore((s) => s.history);
  const removeFromHistory = useAppStore((s) => s.removeFromHistory);
  const clearHistory = useAppStore((s) => s.clearHistory);

  const handleDelete = useCallback(
    (id: string) => {
      removeFromHistory(id);
      showToast("Removed from history", "info");
    },
    [removeFromHistory, showToast],
  );

  const handleClearAll = useCallback(() => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to clear all download history?")) {
        clearHistory();
        showToast("History cleared", "info");
      }
    } else {
      Alert.alert(
        "Clear History",
        "Are you sure you want to clear all download history?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear",
            style: "destructive",
            onPress: () => {
              clearHistory();
              showToast("History cleared", "info");
            },
          },
        ],
      );
    }
  }, [clearHistory, showToast]);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 100,
        paddingHorizontal: 20,
        gap: 16,
        maxWidth: 600,
        alignSelf: "center",
        width: "100%",
      }}
    >
      {/* Header */}
      <Animated.View
        entering={FadeIn.duration(400)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 8,
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontFamily: Fonts.bold,
              fontSize: 28,
              color: colors.text,
              letterSpacing: -0.5,
            }}
          >
            History
          </Text>
          <Text
            style={{
              fontFamily: Fonts.regular,
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            {history.length > 0
              ? `${history.length} download${history.length !== 1 ? "s" : ""}`
              : "No downloads yet"}
          </Text>
        </View>
        {history.length > 0 && (
          <Pressable
            onPress={handleClearAll}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              borderCurve: "continuous",
              backgroundColor: pressed ? colors.errorMuted : "transparent",
            })}
          >
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text
              style={{
                fontFamily: Fonts.semiBold,
                fontSize: 13,
                color: colors.error,
              }}
            >
              Clear All
            </Text>
          </Pressable>
        )}
      </Animated.View>

      {/* History list or empty state */}
      {history.length === 0 ? (
        <EmptyState
          icon="time-outline"
          title="No Downloads Yet"
          subtitle="Videos you download will appear here. Go to the Download tab to get started!"
        />
      ) : (
        <Animated.View layout={LinearTransition} style={{ gap: 10 }}>
          {history.map((item, index) => (
            <HistoryItem
              key={item.id}
              item={item}
              onDelete={handleDelete}
              index={index}
            />
          ))}
        </Animated.View>
      )}
    </ScrollView>
  );
}
