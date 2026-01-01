import Store from "@/db/Store";
import Friend from "@/types/friend";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import * as Animatable from "react-native-animatable";

export default function SplitBill() {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<Set<string>>(new Set());
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"incoming" | "outgoing">("incoming");

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = async () => {
    const friendsResp: Friend[] = await Store.getFriends();
    setFriends(friendsResp || []);
  };

  const toggleFriendSelection = (id: string) => {
    setSelectedFriends((prev) => {
      const set = new Set(prev);
      set.has(id) ? set.delete(id) : set.add(id);
      return set;
    });
  };

  const handleSplit = async () => {
    if (selectedFriends.size === 0) {
      return;
    }
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return;
    }

    try {
      const splitTxnDetails = {
        friendIds: Array.from(selectedFriends),
        totalAmount: Number(amount) / selectedFriends.size,
        description: description || "No description",
        category: "food" as const,
        type,
      }
      await Store.splitAmount(splitTxnDetails);
      
      setAmount("");
      setDescription("");
      setSelectedFriends(new Set());
      loadFriends();
    } catch (error) {
      console.error("Error splitting amount:", error);
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
    <View className="flex-1 bg-[#0B0B0D] px-6">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold">Split Bill</Text>
        <Text className="text-neutral-400 text-sm mt-1">
          Divide expenses among friends
        </Text>
      </View>

      {/* Friends */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
        Select Friends
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item, index }) => {
          const avatarColor = colors[index % colors.length];
          const isSelected = selectedFriends.has(item.id);
          const balance = Number(item.balance);

          return (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 60}
              duration={450}
              className="mb-3"
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => toggleFriendSelection(item.id)}
                className={`flex-row items-center justify-between px-4 py-3 rounded-2xl border ${
                  isSelected
                    ? "bg-white/5 border-white/20"
                    : "bg-[#0F0F12] border-neutral-800"
                }`}
              >
                {/* Left */}
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ backgroundColor: avatarColor }}
                    className="w-9 h-9 rounded-full items-center justify-center"
                  >
                    <Text className="text-white text-sm font-semibold">
                      {item.firstName[0]}
                      {item.lastName[0]}
                    </Text>
                  </View>

                  <Text
                    className="text-white text-base font-medium max-w-[160px]"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.firstName} {item.lastName}
                  </Text>
                </View>

                {/* Right balance */}
                <Text
                  className={`text-sm font-semibold ${
                    balance === 0
                      ? "text-white"
                      : balance > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {balance === 0
                    ? "₹0.00"
                    : balance > 0
                    ? `₹${balance.toFixed(2)}`
                    : `-₹${Math.abs(balance).toFixed(2)}`}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          );
        }}
      />

      {/* Amount */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mt-4 mb-2">
        Total Amount
      </Text>
      <TextInput
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter total amount"
        keyboardType="numeric"
        placeholderTextColor="#6B7280"
        className="bg-[#0F0F12] border border-neutral-800 text-white px-5 py-4 rounded-2xl"
      />

      {/* Description */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mt-4 mb-2">
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
      <View className="flex-row mt-6 mb-8">
        <TouchableOpacity
          onPress={() => setType("incoming")}
          className={`flex-1 py-4 mr-2 rounded-2xl items-center ${
            type === "incoming" ? "bg-green-500/20" : "bg-[#0F0F12]"
          }`}
        >
          <Text
            className={`font-semibold ${
              type === "incoming" ? "text-green-400" : "text-neutral-400"
            }`}
          >
            Add
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("outgoing")}
          className={`flex-1 py-4 ml-2 rounded-2xl items-center ${
            type === "outgoing" ? "bg-red-500/20" : "bg-[#0F0F12]"
          }`}
        >
          <Text
            className={`font-semibold ${
              type === "outgoing" ? "text-red-400" : "text-neutral-400"
            }`}
          >
            Deduct
          </Text>
        </TouchableOpacity>
      </View>

      {/* CTA */}
      <TouchableOpacity
        onPress={handleSplit}
        activeOpacity={0.85}
        className="bg-white py-4 mb-8 rounded-2xl items-center"
      >
        <Text className="text-black text-lg font-semibold">
          Split Amount
        </Text>
      </TouchableOpacity>
    </View>
  );
}
