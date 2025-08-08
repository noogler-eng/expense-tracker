import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";
import Store from "@/db/Store";
import { useRouter } from "expo-router";

export default function AddExpense() {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"incoming" | "outgoing">("incoming");
  const router = useRouter();

  useEffect(() => {
    const fetchFriends = async () => {
      const userData = await Store.getCurrentUser();
      setFriends(userData.friends || []);
    };
    fetchFriends();
  }, []);

  const handleSave = async () => {
    if (!selectedFriend) {
      Alert.alert("Select Friend", "Please select a friend.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    try {
      await Store.addMoneyToFriend(
        selectedFriend,
        Number(amount),
        description || "No description",
        type
      );
      Alert.alert("Success", "Expense added!");
      setAmount("");
      setDescription("");
      setSelectedFriend(null);

      router.push("/");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add expense.");
    }
  };

  const colors = [
    "#8B0000",
    "#004080",
    "#006400",
    "#4B0082",
    "#800000",
    "#9932CC",
    "#B22222",
    "#2F4F4F",
  ];

  return (
    <View className="flex-1 bg-black px-6 py-8">
      <Text className="text-white text-2xl font-bold mb-6">Add Expense</Text>

      {/* Friends List */}
      <Text className="text-neutral-300 mb-2">Select Friend</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const avatarColor = colors[index % colors.length];
          const isSelected = selectedFriend === item.id;
          return (
            <TouchableOpacity
              onPress={() => setSelectedFriend(item.id)}
              className={`items-center mr-4 ${
                isSelected ? "opacity-100" : "opacity-60"
              }`}
            >
              <View
                style={{ backgroundColor: avatarColor }}
                className="w-12 h-12 rounded-full items-center justify-center"
              >
                <Text className="text-white font-bold text-lg">
                  {item.firstName[0]}
                  {item.lastName[0]}
                </Text>
              </View>
              <Text className="text-white mt-1 text-xs">{item.firstName}</Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Amount */}
      <Text className="text-neutral-300 mt-6 mb-2">Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        placeholderTextColor="#6b7280"
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl"
      />

      {/* Description */}
      <Text className="text-neutral-300 mt-6 mb-2">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        placeholderTextColor="#6b7280"
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl"
      />

      {/* Type Selector */}
      <View className="flex-row mt-6 mb-8">
        <TouchableOpacity
          onPress={() => setType("incoming")}
          className={`flex-1 py-3 mr-2 rounded-xl items-center ${
            type === "incoming" ? "bg-green-700" : "bg-neutral-800"
          }`}
        >
          <Text className="text-white font-semibold">Add</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType("outgoing")}
          className={`flex-1 py-3 ml-2 rounded-xl items-center ${
            type === "outgoing" ? "bg-red-700" : "bg-neutral-800"
          }`}
        >
          <Text className="text-white font-semibold">Deduct</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity
        onPress={handleSave}
        className="bg-neutral-700 py-4 rounded-xl items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold">Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}
