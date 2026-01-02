import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import Svg, { Path } from "react-native-svg";

export default function EntryPoint() {
  const waveOpacity = useRef(new Animated.Value(0.4)).current;
  const waveY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating up-down animation
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(waveY, {
            toValue: -4,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(waveOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(waveY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(waveOpacity, {
            toValue: 0.4,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
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
    </View>
  );
}
