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
import * as Animatable from "react-native-animatable";

export default function SplitBill() {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(
    new Set()
  );
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"incoming" | "outgoing">("incoming");

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    try {
      const userData = await Store.getCurrentUser();
      setFriends(userData.friends || []);
    } catch (error) {
      console.error("Failed to load friends:", error);
    }
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSplit = async () => {
    if (selectedFriends.size === 0) {
      Alert.alert("No Friends Selected", "Please select at least one friend.");
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }

    console.log(type);
    try {
      await Store.splitAmount(
        Array.from(selectedFriends),
        Number(amount),
        description || "No description",
        type
      );
      Alert.alert("Success", "Amount split successfully!");
      setAmount("");
      setDescription("");
      setSelectedFriends(new Set());
      await loadFriends();
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to split amount.");
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
      <Text className="text-white text-2xl font-bold mb-6">Split Bill</Text>

      <Text className="text-neutral-300 mb-2">Select Friends</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="h-[1px] bg-neutral-800" />
        )}
        renderItem={({ item, index }) => {
          const avatarColor = colors[index % colors.length];
          const isSelected = selectedFriends.has(item.id);
          return (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 80}
              duration={500}
              key={item.id}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggleFriendSelection(item.id)}
                className={`flex-row items-center justify-between px-4 py-2 rounded-xl mb-2 ${
                  isSelected ? "bg-neutral-700" : "bg-neutral-900"
                }`}
              >
                <View className="flex-row items-center space-x-3">
                  <View
                    style={{ backgroundColor: avatarColor }}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <Text className="text-white font-bold text-sm">
                      {item.firstName[0]}
                      {item.lastName[0]}
                    </Text>
                  </View>
                  <Text className="text-white font-medium">
                    {item.firstName} {item.lastName}
                  </Text>
                </View>

                <Text
                  className={`text-base font-semibold ${
                    item.balance > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.balance > 0
                    ? `+₹${Number(item.balance).toFixed(2)}`
                    : `-₹${Math.abs(Number(item.balance)).toFixed(2)}`}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          );
        }}
      />

      {/* Amount input */}
      <Text className="text-neutral-300 mt-4 mb-2">Total Amount</Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter total amount"
        keyboardType="numeric"
        placeholderTextColor="#6b7280"
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl"
      />

      {/* Description input */}
      <Text className="text-neutral-300 mt-4 mb-2">Description</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Enter description"
        placeholderTextColor="#6b7280"
        className="bg-neutral-900 text-white px-4 py-3 rounded-xl"
      />

      {/* Type selector */}
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

      {/* Save button */}
      <TouchableOpacity
        onPress={handleSplit}
        className="bg-neutral-700 py-4 rounded-xl items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white text-lg font-semibold">Split Amount</Text>
      </TouchableOpacity>
    </View>
  );
}
