import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const phrases = ["syncing", "loading", "almost there"];

export default function LoadingScreen() {
  const { colors: t } = useTheme();
  const waveOpacity = useRef(new Animated.Value(0.5)).current;
  const waveY = useRef(new Animated.Value(4)).current;
  const dotScale = useRef(new Animated.Value(0.8)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(waveOpacity, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(waveOpacity, { toValue: 0.4, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(waveY, { toValue: -6, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(waveY, { toValue: 6, duration: 1400, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(dotScale, { toValue: 1.2, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
          Animated.timing(dotScale, { toValue: 0.8, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        ]),
      ])
    ).start();

    const interval = setInterval(() => setIndex((i) => (i + 1) % phrases.length), 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ backgroundColor: t.bg }} className="flex-1 items-center justify-center">
      {/* Pulsing dot */}
      <Animated.View
        style={{
          width: 12,
          height: 12,
          borderRadius: 6,
          backgroundColor: "#6366F1",
          marginBottom: 24,
          transform: [{ scale: dotScale }],
          opacity: waveOpacity,
        }}
      />

      {/* Secondary echo wave */}
      <Animated.View
        style={{
          position: "absolute",
          opacity: 0.2,
          transform: [{ translateY: waveY }],
        }}
      >
        <Svg width={140} height={28} viewBox="0 0 140 28">
          <Path
            d="M0 14 C20 4, 40 24, 60 14 S100 24, 120 14 S130 4, 140 14"
            stroke="#6366F1"
            strokeWidth="1.2"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Primary wave */}
      <Animated.View
        style={{
          opacity: waveOpacity,
          transform: [{ translateY: waveY }],
        }}
      >
        <Svg width={120} height={20} viewBox="0 0 120 20">
          <Path
            d="M0 10 C15 0, 30 20, 45 10 S75 20, 90 10 S105 0, 120 10"
            stroke="#818CF8"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* Status text */}
      <Text style={{ color: t.textSecondary }} className="text-[11px] mt-7 tracking-[3px] uppercase">
        {phrases[index]}
      </Text>

      <Text style={{ color: t.textMuted }} className="text-[10px] mt-2 tracking-wider">
        please wait
      </Text>
    </View>
  );
}
