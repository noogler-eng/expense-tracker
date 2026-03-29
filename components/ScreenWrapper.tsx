import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "./ThemeContext";

export default function ScreenWrapper({ children }: any) {
 const { colors, cardStyle, inputStyle } = useTheme();

 return (
 <SafeAreaView
 style={{ flex: 1, backgroundColor: colors.bg }}
 edges={["left", "right"]}
 >
 <View style={{ flex: 1, backgroundColor: colors.bg }}>
 {children}
 </View>
 </SafeAreaView>
 );
}
