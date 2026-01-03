import OnboardingSheet from "@/components/bottomsheets/OnboardingSheet";
import EntryPoint from "@/components/EntryPoint";
import LoadingScreen from "@/components/Loading";
import getCurrentUser from "@/db/helper/user/getCurrentUser";
import setCurrentUser from "@/db/helper/user/setCurrentUser";
import User from "@/types/helper/userType";
import colors from "@/utils/helper/colors";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function Onboarding() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOnboardingSheet, setShowOnboardingSheet] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const handleStart = async () => {
    if (!firstName.trim() || !lastName.trim()) return;
    setLoading(true);

    try {
      await setCurrentUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        dateOfBirth: "",
        gender: "",
        income: 0,
        history: [],
      });
      router.replace("/");
    } catch (error) {
      console.error("Failed to save user on onboarding page: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const data: User | undefined = await getCurrentUser();
      if (data?.firstName && data?.lastName) {
        router.replace("/");
      }
    };
    checkUser();
  }, [pathname]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <KeyboardAvoidingView
        className={`flex-1 bg-[${colors.black}]`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-4">
            <EntryPoint />
          </View>

          {/* App Name */}
          <Animated.Text
            entering={FadeInDown.duration(800).springify()}
            className="text-white text-4xl font-bold mb-3"
            style={{ letterSpacing: 2 }}
          >
            Resolve
          </Animated.Text>

          {/* Tagline */}
          <Animated.Text
            entering={FadeInDown.delay(200).duration(800)}
            className="text-neutral-400 text-sm mb-12 text-center"
          >
            personal finance made simple
          </Animated.Text>

          {/* First Name Field */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            className="w-full mb-4"
          >
            <Text className="text-neutral-400 text-sm mb-2 ml-1">
              First Name
            </Text>
            <View className="relative">
              <TextInput
                className={`w-full bg-[${colors.inputBoxBackground}] rounded-2xl px-5 py-4 text-white text-base border border-neutral-800`}
                placeholder="Enter your first name"
                placeholderTextColor={colors.placeholder}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
            </View>
          </Animated.View>

          {/* Last Name Field */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            className="w-full mb-8"
          >
            <Text className="text-neutral-400 text-sm mb-2 ml-1">
              Last Name
            </Text>
            <View className="relative">
              <TextInput
                className={`w-full bg-[${colors.inputBoxBackground}] rounded-2xl px-5 py-4 text-white text-base border border-neutral-800`}
                placeholder="Enter your last name"
                placeholderTextColor={colors.placeholder}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>
          </Animated.View>

          {/* Continue Button */}
          <Animated.View
            entering={FadeInDown.delay(600).duration(600)}
            className="w-full"
          >
            <TouchableOpacity
              disabled={!firstName.trim() || !lastName.trim() || loading}
              onPress={handleStart}
              activeOpacity={0.8}
              className="w-full overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={
                  firstName.trim() && lastName.trim() && !loading
                    ? [colors.white, "#F3F4F6"]
                    : ["#1A1A1A", colors.inputBoxBackground]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="py-4 px-6"
              >
                <Text
                  className={`text-center text-lg font-semibold ${
                    firstName.trim() && lastName.trim() && !loading
                      ? "text-black"
                      : "text-neutral-500"
                  }`}
                >
                  {loading ? "Getting Started..." : "Continue"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {/* Footer Text */}
          <Animated.View
            entering={FadeInDown.delay(700).duration(600)}
            className="mt-8"
          >
            <Text className="text-neutral-500 text-xs text-center">
              You can update your profile anytime in settings
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
      {showOnboardingSheet && (
        <OnboardingSheet onClose={() => setShowOnboardingSheet(false)} />
      )}
    </>
  );
}
