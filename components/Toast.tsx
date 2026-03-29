import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

type ToastType = "success" | "error" | "info";

interface ToastData {
  message: string;
  type: ToastType;
}

interface ToastContextType {
  show: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ show: () => {} });

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
};

const COLORS: Record<ToastType, { bg: string; border: string; text: string }> = {
  success: { bg: "#052E16", border: "#16A34A", text: "#4ADE80" },
  error: { bg: "#2D0A0A", border: "#DC2626", text: "#F87171" },
  info: { bg: "#0C1929", border: "#2563EB", text: "#60A5FA" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => setToast(null), []);

  const show = useCallback((message: string, type: ToastType = "success") => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setToast({ message, type });
    translateY.value = withSequence(
      withTiming(0, { duration: 250, easing: Easing.out(Easing.cubic) }),
      withDelay(
        2200,
        withTiming(-100, { duration: 200, easing: Easing.in(Easing.cubic) }, () => {
          runOnJS(hide)();
        })
      )
    );
    opacity.value = withSequence(
      withTiming(1, { duration: 250 }),
      withDelay(2200, withTiming(0, { duration: 200 }))
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const c = toast ? COLORS[toast.type] : COLORS.info;

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 60,
              left: 20,
              right: 20,
              zIndex: 9999,
              backgroundColor: c.bg,
              borderColor: c.border,
              borderWidth: 1,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 10,
            },
            animStyle,
          ]}
        >
          <View
            style={{ backgroundColor: c.border }}
            className="w-7 h-7 rounded-full items-center justify-center mr-3"
          >
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
              {ICONS[toast.type]}
            </Text>
          </View>
          <Text
            style={{ color: c.text, fontSize: 14, fontWeight: "500", flex: 1 }}
            numberOfLines={2}
          >
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
