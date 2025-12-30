import ScreenWrapper from "@/components/ScreenWrapper";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ScreenWrapper>
      <Stack screenOptions={{ headerShown: false }} />
    </ScreenWrapper>
  );
}
