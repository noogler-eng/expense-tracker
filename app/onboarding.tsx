import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { usePathname, useRouter } from "expo-router";
import Store from "@/db/Store";

export default function Onboarding() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();

  const pathname = usePathname();

  const handleStart = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    Store.initialize(firstName, lastName);
    router.push("/");
  };

  useEffect(() => {
    const isPresent = async () => {
      const data = await Store.getCurrentUser();
      if (data.firstName && data.lastName) {
        router.push("/");
      }
    };
    isPresent();
  }, [pathname]);

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 items-center justify-center px-6">
        {/* App Name Animation */}
        <Animated.Text
          entering={FadeInDown.duration(800).springify()}
          className="text-white text-4xl font-bold mb-10"
          style={{ letterSpacing: 2 }}
        >
          SplitMate
        </Animated.Text>

        {/* First Name Field */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          className="w-full mb-5"
        >
          <Text className="text-gray-400 mb-2">First Name</Text>
          <TextInput
            className="w-full border border-gray-700 rounded-xl px-4 py-3 text-white bg-[#111]"
            placeholder="Enter your first name"
            placeholderTextColor="#555"
            value={firstName}
            onChangeText={setFirstName}
          />
        </Animated.View>

        {/* Last Name Field */}
        <Animated.View
          entering={FadeInDown.delay(500).duration(600)}
          className="w-full mb-8"
        >
          <Text className="text-gray-400 mb-2">Last Name</Text>
          <TextInput
            className="w-full border border-gray-700 rounded-xl px-4 py-3 text-white bg-[#111]"
            placeholder="Enter your last name"
            placeholderTextColor="#555"
            value={lastName}
            onChangeText={setLastName}
          />
        </Animated.View>

        {/* Continue Button */}
        <Animated.View
          entering={FadeInDown.delay(700).duration(600)}
          className="w-full"
        >
          <TouchableOpacity
            className={`w-full py-4 rounded-xl ${firstName && lastName ? "bg-white" : "bg-[#1A1A1A]"}`}
            disabled={!firstName.trim() || !lastName.trim()}
            onPress={handleStart}
          >
            <Text
              className={`text-center text-lg font-semibold ${
                firstName && lastName ? "text-black" : "text-gray-400"
              }`}
            >
              Continue
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}
