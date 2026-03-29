import FloatingActionMenu from "@/components/FloatingActionMenu";
import Header from "@/components/Header";
import { useTheme } from "@/components/ThemeContext";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const { colors: t } = useTheme();

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
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <Header
        subtitle="Your personal expense tracker"
        rightComponent={
          <TouchableOpacity onPress={() => router.replace("/setting")}>
            <Settings2 size={24} color={t.textSecondary} />
          </TouchableOpacity>
        }
      />

      <Stack screenOptions={{ headerShown: false }} />

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
