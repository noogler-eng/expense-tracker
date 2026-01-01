import Store from "@/db/Store";
import User from "@/types/user";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";

// SVG Icons
const UserIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
      stroke="#8B5CF6"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="7" r="4" stroke="#8B5CF6" strokeWidth="2" />
  </Svg>
);

const CalendarIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke="#EC4899"
      strokeWidth="2"
    />
    <Path d="M16 2v4M8 2v4M3 10h18" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const GenderIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="14" r="4" stroke="#6366F1" strokeWidth="2" />
    <Path d="M12 6v4M19 9l-2.5 2.5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <Path d="M19 4v5h-5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MoneyIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const SaveIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const ChevronIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default function Setting() {
  // User info
  const [settingData, setSettingData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    income: 0,
  });

  // DOB Picker
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Helpers
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user: User = await Store.getCurrentUser();
        setSettingData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          dateOfBirth: user.dateOfBirth || "",
          gender: user.gender || "",
          income: user.income || 0,
        });
               
        if (user.dateOfBirth) {
          const parsedDate = new Date(user.dateOfBirth);
          if (!isNaN(parsedDate.getTime())) {
            setDobDate(parsedDate);
          }
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    };

    loadUser();
  }, []);

  // Save handler
  const handleSave = async () => {
    if (!settingData.firstName.trim() || !settingData.lastName.trim()) return;

    setLoading(true);
    try {
      await Store.setCurrentUser({
        firstName: settingData.firstName.trim(),
        lastName: settingData.lastName.trim(),
        dateOfBirth: settingData.dateOfBirth,
        gender: settingData.gender,
        income: settingData.income,
      });

    } catch (error) {
      console.error("error while setting new data", error);
    } finally {
      setLoading(false);
    }
  };


  const handleClearCache = async() => {
    setLoading(true);
    try {
      await Store.clearCache();
      router.replace("/onboarding");
    } catch (error) {
      console.error("error while clearing cache", error);
    } finally {
      setLoading(false);
    }
  }

  const genderOptions = ["Male", "Female", "Non-binary", "Prefer not to say"];

  return (
    <View className="flex-1 bg-[#0B0B0D]">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8 pb-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-white text-3xl font-bold mb-2">Settings</Text>
            <Text className="text-neutral-400 text-sm">
              Manage your personal information
            </Text>
          </View>

          {/* Profile Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-purple-500 rounded-full mr-3" />
              <Text className="text-white text-lg font-semibold">
                Profile Information
              </Text>
            </View>

            {/* First Name */}
            <View className="mb-5">
              <Text className="text-neutral-400 text-sm mb-2 ml-1">
                First Name
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-1/2 -mt-2.5 z-10">
                  <UserIcon />
                </View>
                <TextInput
                  value={settingData.firstName}
                  onChangeText={(text) => setSettingData({ ...settingData, firstName: text })}
                  placeholder="Enter your first name"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="words"
                  className="bg-[#0F0F12] text-white pl-14 pr-5 py-4 rounded-2xl border border-neutral-800 text-base z-[-10]"
                />
              </View>
            </View>

            {/* Last Name */}
            <View className="mb-5">
              <Text className="text-neutral-400 text-sm mb-2 ml-1">
                Last Name
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-1/2 -mt-2.5 z-10">
                  <UserIcon />
                </View>
                <TextInput
                  value={settingData.lastName}
                  onChangeText={(text) => setSettingData({ ...settingData, lastName: text })}
                  placeholder="Enter your last name"
                  placeholderTextColor="#6B7280"
                  autoCapitalize="words"
                  className="bg-[#0F0F12] text-white pl-14 pr-5 py-4 rounded-2xl border border-neutral-800 text-base"
                />
              </View>
            </View>
          </View>

          {/* Personal Details Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-pink-500 rounded-full mr-3" />
              <Text className="text-white text-lg font-semibold">
                Personal Details
              </Text>
            </View>

            {/* Date of Birth */}
            <View className="mb-5">
              <Text className="text-neutral-400 text-sm mb-2 ml-1">
                Date of Birth
              </Text>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setShowDatePicker(true)}
                className="relative"
              >
                <View className="absolute left-4 top-1/2 -mt-2.5 z-10">
                  <CalendarIcon />
                </View>
                <View className="bg-[#0F0F12] pl-14 pr-5 py-4 rounded-2xl border border-neutral-800 flex-row items-center justify-between">
                  <Text
                    className={`text-base ${
                      settingData.dateOfBirth ? "text-white" : "text-neutral-500"
                    }`}
                  >
                    {settingData.dateOfBirth || "Select date of birth"}
                  </Text>
                  <ChevronIcon />
                </View>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={dobDate ?? new Date(2000, 0, 1)}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                maximumDate={new Date()}
                themeVariant="dark"
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDobDate(selectedDate);
                    setSettingData({ ...settingData, dateOfBirth: selectedDate.toISOString().split("T")[0] });
                  }
                }}
              />
            )}

            {/* Gender */}
            <View className="mb-5">
              <Text className="text-neutral-400 text-sm mb-2 ml-1">Gender</Text>
              <View className="relative">
                <View className="absolute left-4 top-1/2 -mt-2.5 z-10">
                  <GenderIcon />
                </View>
                <View className="bg-[#0F0F12] rounded-2xl border border-neutral-800 overflow-hidden">
                  {genderOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      activeOpacity={0.7}
                      onPress={() => setSettingData({ ...settingData, gender: option })}
                      className={`pl-14 pr-5 py-4 flex-row items-center justify-between ${
                        index < genderOptions.length - 1
                          ? "border-b border-neutral-800"
                          : ""
                      }`}
                    >
                      <Text
                        className={`text-base ${
                          settingData.gender === option ? "text-white font-medium" : "text-neutral-400"
                        }`}
                      >
                        {option}
                      </Text>
                      {settingData.gender === option && (
                        <View className="w-5 h-5 rounded-full bg-indigo-500 items-center justify-center">
                          <View className="w-2 h-2 rounded-full bg-white" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Financial Section */}
          <View className="mb-8">
            <View className="flex-row items-center mb-4">
              <View className="w-1 h-6 bg-green-500 rounded-full mr-3" />
              <Text className="text-white text-lg font-semibold">
                Financial Information
              </Text>
            </View>

            {/* Income */}
            <View className="mb-5">
              <Text className="text-neutral-400 text-sm mb-2 ml-1">
                Monthly Income
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-1/2 -mt-2.5 z-10">
                  <MoneyIcon />
                </View>
                <TextInput
                  value={String(settingData.income)}
                  onChangeText={(text) => setSettingData({ ...settingData, income: Number(text) })}
                  placeholder="Enter your monthly income"
                  placeholderTextColor="#6B7280"
                  keyboardType="numeric"
                  className="bg-[#0F0F12] text-white pl-14 pr-5 py-4 rounded-2xl border border-neutral-800 text-base"
                />
              </View>
              <Text className="text-neutral-500 text-xs mt-2 ml-1">
                This helps us provide better financial insights
              </Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.8}
            className="overflow-hidden rounded-2xl"
          >
            <LinearGradient
              colors={
                loading
                  ? ["#404040", "#262626"]
                  : ["#FFFFFF", "#F3F4F6"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-4 px-6 flex-row items-center justify-center"
            >
              <View className="mr-2">
                <SaveIcon />
              </View>
              <Text
                className={`text-lg font-semibold ${
                  loading ? "text-neutral-400" : "text-black"
                }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* clear cache Button */}
          <TouchableOpacity
            onPress={handleClearCache}
            disabled={loading}
            activeOpacity={0.8}
            className="overflow-hidden rounded-2xl my-4"
          >
            <LinearGradient
              colors={
                loading
                  ? ["#404040", "#262626"]
                  : ["#FFFFFF", "#F3F4F6"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="py-4 px-6 flex-row items-center justify-center"
            >
              <View className="mr-2">
                <SaveIcon />
              </View>
              <Text
                className={`text-lg font-semibold ${
                  loading ? "text-neutral-400" : "text-black"
                }`}
              >
                {loading ? "clearing..." : "Clear Cache"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Info Card */}
          <View className="mt-6 bg-[#0F0F12] rounded-2xl p-4 border border-neutral-800">
            <View className="flex-row">
              <View className="w-1 h-full bg-blue-500 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="text-white font-semibold mb-1">
                  Privacy Note
                </Text>
                <Text className="text-neutral-400 text-sm leading-5">
                  Your personal information is encrypted and stored securely. We
                  never share your data with third parties.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}