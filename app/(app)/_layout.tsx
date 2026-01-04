import FloatingActionMenu from "@/components/FloatingActionMenu";
import Header from "@/components/Header";
import Store from "@/db/Store";
import "@/global.css";
import { BlurView } from "expo-blur";
import { Stack, usePathname, useRouter } from "expo-router";
import { Settings2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function RootLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (checked) return;

    const checkUser = async () => {
      const data = await Store.getCurrentUser();

      if (data?.firstName && data?.lastName && pathname === "/onboarding") {
        router.replace("/");
      }

      setChecked(true);
    };

    checkUser();
  }, [checked]);

  if (!checked) return null;

  return (
    <View style={{ flex: 1 }}>
      <Header
        subtitle="Your personal expense tracker"
        rightComponent={
          <TouchableOpacity onPress={() => router.replace("/setting")}>
            <Settings2 size={24} color="#eee" />
          </TouchableOpacity>
        }
      />

      <Stack screenOptions={{ headerShown: false }} />

      {menuOpen && (
        <BlurView
          intensity={100}
          tint="dark"
          style={StyleSheet.absoluteFillObject}
        />
      )}

      {pathname !== "/onboarding" && (
        <FloatingActionMenu
          isOpen={menuOpen}
          onOpen={() => setMenuOpen(true)}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </View>
  );
}
