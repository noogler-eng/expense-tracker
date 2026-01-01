import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

const phrases = ["syncing", "verifying", "stabilizing"];

export default function LoadingScreen() {
  const waveOpacity = useRef(new Animated.Value(0.5)).current;
  const waveY = useRef(new Animated.Value(4)).current;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(waveOpacity, {
            toValue: 1,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveOpacity, {
            toValue: 0.5,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(waveY, {
            toValue: -4,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(waveY, {
            toValue: 4,
            duration: 1600,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();

    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <View className="flex-1 bg-[#0B0B0D] items-center justify-center">

      {/* Secondary echo wave */}
      <Animated.View
        style={{
          position: "absolute",
          opacity: 0.25,
          transform: [{ translateY: waveY }],
        }}
      >
        <Svg width={140} height={28} viewBox="0 0 140 28">
          <Path
            d="M0 14 C20 4, 40 24, 60 14 S100 24, 120 14 S130 4, 140 14"
            stroke="#6366F1"
            strokeWidth="1.2"
            strokeLinecap="round"
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
          />
        </Svg>
      </Animated.View>

      {/* Primary system state */}
      <Text className="text-neutral-500 text-[11px] mt-7 tracking-[3px] uppercase">
        {phrases[index]}
      </Text>

      {/* Secondary system hint */}
      <Text className="text-neutral-700 text-[10px] mt-2 tracking-wider">
        establishing secure session
      </Text>

      {/* Tertiary trust micro-copy */}
      <Text className="text-neutral-800 text-[9px] mt-4 tracking-wide">
        end-to-end encrypted
      </Text>

    </View>
  );
}
