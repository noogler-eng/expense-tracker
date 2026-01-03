import ScreenWrapper from "@/components/ScreenWrapper";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <ScreenWrapper>
        <Stack screenOptions={{ headerShown: false }} />
      </ScreenWrapper>
    </GestureHandlerRootView>
  );
}
