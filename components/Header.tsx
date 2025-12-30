import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import { Home } from "lucide-react-native";
import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

interface HeaderProps {
  title?: string;
  subtitle?: string;
  rightComponent?: React.ReactNode;
}

export default function Header({
  title = "Resolve",
  subtitle = "personal finance made simple",
  rightComponent,
}: HeaderProps) {
  // Animation values
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const rightAnim = useRef(new Animated.Value(0)).current;
  const dividerAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const pathname = usePathname();

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.spring(titleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(subtitleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 100,
        useNativeDriver: true,
      }),
      Animated.spring(rightAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(dividerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const titleTranslateX = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-30, 0],
  });

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 200],
  });

  const dividerTranslateX = dividerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-400, 400],
  });

  const router = useRouter();

  return (
    <View className="bg-[#0B0B0D] py-4 relative overflow-hidden shadow-2xl">
      {/* Background gradient overlay */}
      <View className="absolute inset-0 opacity-30">
        <LinearGradient
          colors={["rgba(99, 102, 241, 0.03)", "transparent", "rgba(236, 72, 153, 0.03)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex-1"
        />
      </View>

      <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
        {/* Left side - Title and Subtitle */}
        <View>
          <Animated.View
            style={{
              opacity: titleAnim,
              transform: [{ translateX: titleTranslateX }],
            }}
          >
            <View className="relative">
              {/* Shimmer effect overlay */}
              <Animated.View
                className="absolute inset-0"
                style={{
                  transform: [{ translateX: shimmerTranslateX }],
                }}
              >
                <LinearGradient
                  colors={["transparent", "rgba(255, 255, 255, 0.1)", "transparent"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="flex-1"
                />
              </Animated.View>
              <Text className="text-white text-[26px] font-semibold tracking-tight">
                {title}
              </Text>
            </View>
          </Animated.View>

          {subtitle && (
            <Text className="text-neutral-400 text-[12px] mt-1 tracking-wide">
              {subtitle}
            </Text>
          )}
        </View>

        {/* Right component */}
        {pathname !== "/onboarding" && pathname !== "/setting" && rightComponent && ( 
          <View className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800 items-center justify-center"> 
            {rightComponent} 
          </View>
        )}

        {pathname !== "/onboarding" && pathname !== "/" && ( 
          <View className="h-10 w-10 rounded-full bg-neutral-900 border border-neutral-800 items-center justify-center"> 
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Home size={24} color="#eee" />
            </TouchableOpacity> 
          </View>
        )}
      </View>

      {/* Animated divider */}
      <View className="mx-6 mt-2 h-[1px] overflow-hidden">
        <LinearGradient
          colors={[
            "transparent",
            "rgba(139, 92, 246, 0.3)",
            "rgba(236, 72, 153, 0.3)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="h-full"
        />
        <Animated.View
          className="absolute inset-0"
          style={{
            transform: [{ translateX: dividerTranslateX }],
          }}
        >
          <LinearGradient
            colors={["transparent", "rgba(255, 255, 255, 0.4)", "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="h-full w-full"
          />
        </Animated.View>
      </View>
    </View>
  );
}