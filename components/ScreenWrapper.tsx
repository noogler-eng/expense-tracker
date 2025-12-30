import { SafeAreaView } from "react-native-safe-area-context";

export default function ScreenWrapper({ children }: any) {
  return (
    <SafeAreaView
      style={{ flex: 1 }}
      edges={["left", "right"]}
    >
      {children}
    </SafeAreaView>
  );
}
