import {
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Text, View, Pressable } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/hooks/use-theme";
import { Fonts } from "@/constants/Typography";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

const ICON_MAP: Record<ToastType, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  error: "close-circle",
  info: "information-circle",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    const timer = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timerRef.current.delete(id);
    }, 3000);
    timerRef.current.set(id, timer);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timerRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timerRef.current.delete(id);
    }
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  const getToastColors = (type: ToastType) => {
    switch (type) {
      case "success":
        return { bg: colors.successMuted, accent: colors.success };
      case "error":
        return { bg: colors.errorMuted, accent: colors.error };
      default:
        return { bg: colors.primaryMuted, accent: colors.primary };
    }
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        pointerEvents="box-none"
        style={{
          position: "absolute",
          top: insets.top + 8,
          left: 16,
          right: 16,
          zIndex: 9999,
          gap: 8,
        }}
      >
        {toasts.map((toast) => {
          const toastColors = getToastColors(toast.type);
          return (
            <Animated.View
              key={toast.id}
              entering={FadeInUp.duration(300).springify()}
              exiting={FadeOutUp.duration(200)}
            >
              <Pressable
                onPress={() => dismissToast(toast.id)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  backgroundColor: toastColors.bg,
                  borderWidth: 1,
                  borderColor: toastColors.accent,
                  borderRadius: 14,
                  borderCurve: "continuous",
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`,
                }}
              >
                <Ionicons
                  name={ICON_MAP[toast.type]}
                  size={20}
                  color={toastColors.accent}
                />
                <Text
                  style={{
                    flex: 1,
                    fontFamily: Fonts.medium,
                    fontSize: 14,
                    color: colors.text,
                  }}
                >
                  {toast.message}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </ToastContext.Provider>
  );
}
