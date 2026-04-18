import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeIn, FadeOut, SlideInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "@/hooks/use-theme";
import { Fonts } from "@/constants/Typography";

interface FilenameModalProps {
  visible: boolean;
  defaultFilename: string;
  onConfirm: (filename: string) => void;
  onCancel: () => void;
}

export function FilenameModal({
  visible,
  defaultFilename,
  onConfirm,
  onCancel,
}: FilenameModalProps) {
  const { colors } = useTheme();
  const [filename, setFilename] = useState(defaultFilename);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setFilename(defaultFilename);
      // Auto-focus the input when modal opens
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible, defaultFilename]);

  const handleConfirm = () => {
    const trimmed = filename.trim();
    onConfirm(trimmed || defaultFilename);
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="none"
      visible={visible}
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(150)}
          style={{
            flex: 1,
            backgroundColor: colors.overlay,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
          }}
        >
          <Pressable
            style={{
              position: "absolute",
              inset: 0,
            }}
            onPress={onCancel}
          />

          {/* Modal content */}
          <Animated.View
            entering={SlideInDown.duration(300).springify().damping(18)}
            style={{
              width: "100%",
              maxWidth: 420,
              backgroundColor: colors.surfaceElevated,
              borderRadius: 24,
              borderCurve: "continuous",
              padding: 24,
              gap: 20,
              borderWidth: 1,
              borderColor: colors.border,
              boxShadow: "0 24px 64px rgba(0, 0, 0, 0.4)",
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  borderCurve: "continuous",
                  backgroundColor: colors.primaryMuted,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name="document-text" size={22} color={colors.primary} />
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text
                  style={{
                    fontFamily: Fonts.bold,
                    fontSize: 18,
                    color: colors.text,
                  }}
                >
                  Save Video
                </Text>
                <Text
                  style={{
                    fontFamily: Fonts.regular,
                    fontSize: 13,
                    color: colors.textSecondary,
                  }}
                >
                  Choose a filename for your download
                </Text>
              </View>
            </View>

            {/* Filename input */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontFamily: Fonts.medium,
                  fontSize: 13,
                  color: colors.textSecondary,
                  paddingLeft: 4,
                }}
              >
                Filename
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: colors.inputBackground,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingHorizontal: 14,
                  gap: 10,
                }}
              >
                <Ionicons name="pencil" size={16} color={colors.textTertiary} />
                <TextInput
                  ref={inputRef}
                  value={filename}
                  onChangeText={setFilename}
                  placeholder="Enter filename..."
                  placeholderTextColor={colors.textTertiary}
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="done"
                  onSubmitEditing={handleConfirm}
                  selectTextOnFocus
                  style={{
                    flex: 1,
                    fontFamily: Fonts.regular,
                    fontSize: 15,
                    color: colors.text,
                    paddingVertical: 14,
                  }}
                />
                {filename.length > 0 && (
                  <Pressable onPress={() => setFilename("")} hitSlop={8}>
                    <Ionicons
                      name="close-circle"
                      size={18}
                      color={colors.textTertiary}
                    />
                  </Pressable>
                )}
              </View>
              <Text
                style={{
                  fontFamily: Fonts.regular,
                  fontSize: 12,
                  color: colors.textTertiary,
                  paddingLeft: 4,
                }}
              >
                .mp4 extension will be added automatically
              </Text>
            </View>

            {/* Action buttons */}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => ({
                  flex: 1,
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  backgroundColor: pressed
                    ? colors.surfacePressed
                    : colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                <Text
                  style={{
                    fontFamily: Fonts.semiBold,
                    fontSize: 15,
                    color: colors.textSecondary,
                  }}
                >
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={handleConfirm}
                style={({ pressed }) => ({
                  flex: 2,
                  flexDirection: "row",
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  opacity: pressed ? 0.85 : 1,
                  experimental_backgroundImage:
                    "linear-gradient(135deg, #FF0050 0%, #FF2D78 100%)",
                  boxShadow: "0 4px 16px rgba(255, 0, 80, 0.25)",
                })}
              >
                <Ionicons name="download" size={18} color="#FFFFFF" />
                <Text
                  style={{
                    fontFamily: Fonts.bold,
                    fontSize: 15,
                    color: "#FFFFFF",
                  }}
                >
                  Save
                </Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
