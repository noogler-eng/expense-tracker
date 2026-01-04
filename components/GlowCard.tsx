import React from "react";
import { View } from "react-native";

export default function GlowCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View style={{ position: "relative" }}>
      
      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          shadowColor: "#9755daff",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 18,
          elevation: 10,
        }}
      />

      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          shadowColor: "#150936ff",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 26,
          elevation: 10,
        }}
      />

      <View
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: 28,
          shadowColor: "#000000ff",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 34,
          elevation: 10,
        }}
      />

      <>
        {children}
      </>
    </View>
  );
}
