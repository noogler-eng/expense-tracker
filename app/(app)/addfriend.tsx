import FriendList from "@/components/FriendList";
import Store from "@/db/Store";
import colors from "@/utils/helper/colors";
import React, { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddFriend() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAddFriend = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    try {
      await Store.addFriend({
        firstName: firstName.trim(),
        lastName: lastName.trim()
      });
      setFirstName("");
      setLastName("");
      setRefreshKey((prev) => prev + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 bg-black px-6 py-8">
      <Text className="text-white text-2xl font-bold mb-8">Add Friend</Text>

      {/* First Name */}
      <Text className="text-neutral-300 mb-2">First Name</Text>
      <TextInput
        value={firstName}
        onChangeText={setFirstName}
        placeholder="John"
        placeholderTextColor={colors.placeholder}
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl mb-6"
      />

      {/* Last Name */}
      <Text className="text-neutral-300 mb-2">Last Name</Text>
      <TextInput
        value={lastName}
        onChangeText={setLastName}
        placeholder="Doe"
        placeholderTextColor={colors.placeholder}
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl mb-10"
      />

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleAddFriend}
        className="bg-neutral-800 py-4 rounded-xl items-center mb-8"
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold">Save Friend</Text>
      </TouchableOpacity>

      {/* Friend List */}
      <Text className="text-neutral-400 mb-4">Your Friends</Text>
      <FriendList refreshKey={refreshKey} setRefreshKey={setRefreshKey} />
    </View>
  );
}
