import React from "react";
import { View, Text } from "react-native";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title = "Split Mate",
  subtitle = "Your expense tracker",
  rightComponent,
}: HeaderProps) {
  return (
    <View
      className="flex-row items-center justify-between px-6 py-4 bg-black border-b border-neutral-800"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 6,
      }}
    >
      <View>
        <Text className="text-white text-2xl font-extrabold tracking-tight">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-neutral-400 text-sm mt-1 font-medium tracking-wide">
            {subtitle}
          </Text>
        )}
      </View>

      <View>{rightComponent}</View>
    </View>
  );
}
