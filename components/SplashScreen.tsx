import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Text, View } from "react-native";

interface Props {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: Props) {
  const { colors: t } = useTheme();
  const logoScale = useRef(new Animated.Value(0.7)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo fade in + scale
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      // Title fade in
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Subtitle fade in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(800),
      // Fade everything out
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: t.bg, alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={{ width: 80, height: 80, borderRadius: 20 }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        style={{
          color: t.text,
          fontSize: 28,
          fontWeight: "700",
          marginTop: 20,
          letterSpacing: 2,
          opacity: titleOpacity,
        }}
      >
        Resolve
      </Animated.Text>

      <Animated.Text
        style={{
          color: t.textMuted,
          fontSize: 13,
          marginTop: 8,
          opacity: subtitleOpacity,
        }}
      >
        personal finance made simple
      </Animated.Text>
    </View>
  );
}
