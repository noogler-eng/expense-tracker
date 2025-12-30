import Store from "@/db/Store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

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
      setFriends(userData?.friends || []);
    };
    fetchFriends();
  }, []);

  const handleSave = async () => {
    if (!selectedFriend) {
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }

    try {
      await Store.addMoneyToFriend(
        selectedFriend,
        Number(amount),
        description || "No description",
        type
      );
      setAmount("");
      setDescription("");
      setSelectedFriend(null);
    } catch {
      console.error("Error adding expense");
    }
  };

  const colors = [
    "#7C2D12",
    "#1E3A8A",
    "#14532D",
    "#312E81",
    "#7F1D1D",
    "#581C87",
    "#7C2D12",
    "#1F2933",
  ];

  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold">Add Expense</Text>
        <Text className="text-neutral-400 text-sm mt-1">
          Record money given or received
        </Text>
      </View>

      {/* Friends */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
        Select Friend
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 6 }}
        renderItem={({ item, index }) => {
          const avatarColor = colors[index % colors.length];
          const isSelected = selectedFriend === item.id;

          return (
            <TouchableOpacity
              onPress={() => setSelectedFriend(item.id)}
              activeOpacity={0.85}
              className="items-center mr-4"
            >
              <View
                style={{ backgroundColor: avatarColor }}
                className={`w-12 h-12 rounded-full items-center justify-center border ${
                  isSelected
                    ? "border-white"
                    : "border-transparent"
                }`}
              >
                <Text className="text-white font-semibold text-base">
                  {item.firstName[0]}
                  {item.lastName[0]}
                </Text>
              </View>

              <Text
                className={`mt-2 text-xs ${
                  isSelected
                    ? "text-white"
                    : "text-neutral-500"
                }`}
                numberOfLines={1}
              >
                {item.firstName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Amount */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mt-8 mb-2">
        Amount
      </Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
        placeholderTextColor="#6B7280"
        className="bg-[#0F0F12] border border-neutral-800 text-white px-5 py-4 rounded-2xl"
      />

      {/* Description */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mt-6 mb-2">
        Description
      </Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Optional note"
        placeholderTextColor="#6B7280"
        className="bg-[#0F0F12] border border-neutral-800 text-white px-5 py-4 rounded-2xl"
      />

      {/* Type */}
      <View className="flex-row mt-6 mb-10">
        <TouchableOpacity
          onPress={() => setType("incoming")}
          className={`flex-1 py-4 mr-2 rounded-2xl items-center ${
            type === "incoming"
              ? "bg-green-500/20"
              : "bg-[#0F0F12]"
          }`}
        >
          <Text
            className={`font-semibold ${
              type === "incoming"
                ? "text-green-400"
                : "text-neutral-400"
            }`}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("outgoing")}
          className={`flex-1 py-4 ml-2 rounded-2xl items-center ${
            type === "outgoing"
              ? "bg-red-500/20"
              : "bg-[#0F0F12]"
          }`}
        >
          <Text
            className={`font-semibold ${
              type === "outgoing"
                ? "text-red-400"
                : "text-neutral-400"
            }`}
          >
            Deduct
          </Text>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity
        onPress={handleSave}
        activeOpacity={0.85}
        className="bg-white py-4 mb-8 rounded-2xl items-center"
      >
        <Text className="text-black text-lg font-semibold">
          Save Expense
        </Text>
      </TouchableOpacity>
    </View>
  );
}
