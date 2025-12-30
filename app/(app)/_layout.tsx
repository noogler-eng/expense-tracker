import FloatingActionMenu from "@/components/FloatingActionMenu";
import Header from "@/components/Header";
import Store from "@/db/Store";
import "@/global.css";
import { Stack, usePathname, useRouter } from "expo-router";
import { Settings2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (checked) return;

    const checkUser = async () => {
      const data = await Store.getCurrentUser();

      if (
        data?.firstName &&
        data?.lastName &&
        pathname === "/onboarding"
      ) {
        router.replace("/");
      }

      setChecked(true);
    };

    checkUser();
  }, [checked]);

  if (!checked) return null;

  return (
    <View className="flex-1">
      <Header
        subtitle="Your personal expense tracker"
        rightComponent={
          <TouchableOpacity onPress={() => router.replace("/setting")}>
            <Settings2 size={24} color="#eee" />
          </TouchableOpacity>
        }
      />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="addfriend" />
        <Stack.Screen name="addexpense" />
        <Stack.Screen name="splitbill" />
        <Stack.Screen name="history" />
        <Stack.Screen name="setting" />
      </Stack>

      {pathname !== "/onboarding" && <FloatingActionMenu />}
    </View>
  );
}
