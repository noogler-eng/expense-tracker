import * as Haptics from "expo-haptics";
import FriendList from "@/components/FriendList";
import Store from "@/db/Store";
import { useToast } from "@/components/Toast";
import { useTheme } from "@/components/ThemeContext";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddFriend() {
  const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
  const toast = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddFriend = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (!firstName.trim() || !lastName.trim()) return;

    try {
      await Store.addFriend({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      const name = firstName.trim();
      setFirstName("");
      setLastName("");
      setRefreshKey((prev) => prev + 1);
      toast.show(`${name} has been added.`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }} className="px-6 py-8">
      <Text style={{ color: t.text }} className="text-2xl font-bold mb-8">Add Friend</Text>

      {/* First Name */}
      <Text style={{ color: t.textSecondary }} className="text-sm mb-2">First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="John"
        placeholderTextColor={t.textMuted}
        style={inputStyle}
        className="px-4 py-3 rounded-xl mb-6"
      />

      {/* Last Name */}
      <Text style={{ color: t.textSecondary }} className="text-sm mb-2">Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Doe"
        placeholderTextColor={t.textMuted}
        style={inputStyle}
        className="px-4 py-3 rounded-xl mb-10"
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleAddFriend}
        className="bg-white py-4 rounded-xl items-center mb-8"
        activeOpacity={0.8}
      >
        <Text className="text-black text-lg font-semibold">Save Friend</Text>
      </TouchableOpacity>

      {/* Friend List */}
      <Text style={{ color: t.textSecondary }} className="text-sm mb-4">Your Friends</Text>
      <FriendList refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
    </View>
  );
}
