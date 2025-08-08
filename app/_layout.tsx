import { router, Stack } from "expo-router";
import FloatingActionMenu from "@/components/FloatingActionMenu";
import { usePathname } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import "@/global.css";
import Header from "@/components/Header";
import { Settings2 } from "lucide-react-native";

export default function RootLayout() {
  const pathname = usePathname();

  return (
    <View className="flex-1">
      <Header
        subtitle="Your personal expense tracker"
        rightComponent={
          <TouchableOpacity
            onPress={() => {
              router.push("/setting");
            }}
          >
            <Settings2 size={24} color="#eee" />
          </TouchableOpacity>
        }
      />
      <Stack>
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="addfriend"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="addexpense"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="splitbill"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="setting"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      {pathname !== "/onboarding" && <FloatingActionMenu />}
    </View>
  );
}
