import PinLockGate from "@/components/PinLockGate";
import ScreenWrapper from "@/components/ScreenWrapper";
import SplashScreen from "@/components/SplashScreen";
import { ThemeProvider } from "@/components/ThemeContext";
import { ToastProvider } from "@/components/Toast";
import { Stack } from "expo-router";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <GestureHandlerRootView>
      <ThemeProvider>
        <ToastProvider>
          {showSplash ? (
            <ScreenWrapper>
              <SplashScreen onFinish={() => setShowSplash(false)} />
            </ScreenWrapper>
          ) : (
            <ScreenWrapper>
              <PinLockGate>
                <Stack screenOptions={{ headerShown: false }} />
              </PinLockGate>
            </ScreenWrapper>
          )}
        </ToastProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
