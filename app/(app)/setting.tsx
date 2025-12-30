import Store from "@/db/Store";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface User {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  income?: string;
}

export default function Setting() {
  // User info
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [income, setIncome] = useState("");

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

        setFirstName(user.firstName ?? "");
        setLastName(user.lastName ?? "");
        setDateOfBirth(user.dateOfBirth ?? "");
        setGender(user.gender ?? "");
        setIncome(user.income ?? "");

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
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Validation", "Please enter both first and last names.");
      return;
    }

    setLoading(true);
    try {
      // await Store.setCurrentUser({
      //   firstName: firstName.trim(),
      //   lastName: lastName.trim(),
      //   dateOfBirth,
      //   gender,
      //   income,
      // });

      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "Failed to update user info.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-8">
      {/* Title */}
      <Text className="text-white text-3xl font-semibold mb-8 text-center">
        Settings
      </Text>

      {/* First Name */}
      <Text className="text-neutral-400 mb-2">First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
        placeholderTextColor="#6B7280"
        autoCapitalize="words"
        className="bg-[#0F0F12] text-white px-5 py-4 rounded-2xl border border-neutral-800 mb-6"
      />

      {/* Last Name */}
      <Text className="text-neutral-400 mb-2">Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
        placeholderTextColor="#6B7280"
        autoCapitalize="words"
        className="bg-[#0F0F12] text-white px-5 py-4 rounded-2xl border border-neutral-800 mb-6"
      />

      {/* Date of Birth */}
      <Text className="text-neutral-400 mb-2">Date of Birth</Text>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setShowDatePicker(true)}
        className="bg-[#0F0F12] px-5 py-4 rounded-2xl border border-neutral-800 mb-6"
      >
        <Text
          className={`text-[15px] ${
            dateOfBirth ? "text-white" : "text-neutral-500"
          }`}
        >
          {dateOfBirth || "Select date of birth"}
        </Text>
      </TouchableOpacity>

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
              setDateOfBirth(
                selectedDate.toISOString().split("T")[0]
              );
            }
          }}
        />
      )}

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        activeOpacity={0.85}
        className={`mt-4 py-4 rounded-2xl items-center ${
          loading ? "bg-neutral-700" : "bg-white"
        }`}
      >
        <Text
          className={`text-lg font-semibold ${
            loading ? "text-neutral-300" : "text-black"
          }`}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
