import { useTheme } from "@/components/ThemeContext";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  onClose?: () => void;
}

export default function OnboardingSheet({ onClose }: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const { colors: t, cardStyle } = useTheme();

  const handleContinue = () => {
    sheetRef.current?.close();
    onClose?.();
  };

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={["55%"]}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: t.card,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleIndicatorStyle={{
        backgroundColor: t.textMuted,
        width: 48,
      }}
    >
      <BottomSheetView>
        <View className="px-6 pt-6 flex-1 justify-between">
          <View>
            <Text style={{ color: t.text }} className="text-[26px] font-semibold tracking-tight">
              Welcome to Resolve
            </Text>

            <Text style={{ color: t.textSecondary }} className="text-sm mt-2 leading-5">
              Your personal finance companion to track, analyze, and stay in
              control of your money.
            </Text>

            <View className="mt-6 space-y-3">
              {[
                "Track income & expenses",
                "Understand spending patterns",
                "Stay financially organized",
              ].map((item, index) => (
                <View key={index} style={[cardStyle, { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 8 }]}>
                  <Text style={{ color: t.text }} className="text-sm">{item}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleContinue}
            className="bg-white py-4 rounded-2xl mt-6 mb-10"
          >
            <Text className="text-black text-center font-semibold text-base">
              Get Started
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
