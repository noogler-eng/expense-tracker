import React, { useState, useEffect } from "react";
import { Text, TextInput, TouchableOpacity, Alert, View } from "react-native";
import { useRouter } from "expo-router";
import Store from "@/db/Store";

export default function Setting() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Load current user info on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await Store.getCurrentUser();
        setFirstName(user.firstName || "");
        setLastName(user.lastName || "");
      } catch (e) {
        console.error("Failed to load user data", e);
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Validation", "Please enter both first and last names.");
      return;
    }
    setLoading(true);
    try {
      await Store.setCurrentUser(firstName.trim(), lastName.trim());
      router.push("/");
    } catch (error) {
      Alert.alert("Error", "Failed to update user info.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 py-8">
      <Text className="text-white text-3xl font-bold mb-6 text-center">
        Settings
      </Text>

      <Text className="text-neutral-400 mb-2">First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Enter your first name"
        placeholderTextColor="#6b7280"
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl mb-6"
        autoCapitalize="words"
      />

      <Text className="text-neutral-400 mb-2">Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Enter your last name"
        placeholderTextColor="#6b7280"
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl mb-10"
        autoCapitalize="words"
      />

      <TouchableOpacity
        onPress={handleSave}
        disabled={loading}
        className={`py-4 rounded-xl items-center ${
          loading ? "bg-neutral-700" : "bg-blue-600"
        }`}
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold">
          {loading ? "Saving..." : "Save Changes"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
