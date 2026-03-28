import PinLockGate from "@/components/PinLockGate";
import ScreenWrapper from "@/components/ScreenWrapper";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ScreenWrapper>
        <PinLockGate>
          <Stack screenOptions={{ headerShown: false }} />
        </PinLockGate>
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}
