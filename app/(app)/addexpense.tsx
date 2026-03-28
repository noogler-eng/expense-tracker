import getFriends from "@/db/helper/friends/getFriends";
import simpleTransaction from "@/db/helper/txn/simpleTransaction";
import { Category } from "@/types";
import Friend from "@/types/helper/friendType";
import colors from "@/utils/helper/colors";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Utilities", value: "utilities" },
  { label: "Others", value: "others" },
];

export default function AddExpense() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"incoming" | "outgoing">("incoming");
  const [category, setCategory] = useState<Category>("others");

  useEffect(() => {
    const fetchFriends = async () => {
      const friendsData = await getFriends();
      setFriends(friendsData || []);
    };
    fetchFriends();
  }, []);

  const handleSave = async () => {
    if (!selectedFriend) return;
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;

    try {
      const txn = {
        id: selectedFriend,
        amount: Number(amount),
        description: description || "No description",
        category: type === "outgoing" ? category : ("incoming" as Category),
        type,
      }

      await simpleTransaction(txn);
      setAmount("");
      setDescription("");
      setSelectedFriend(null);
      setCategory("others");
      Alert.alert("Saved", "Expense recorded successfully.");
    } catch {
      console.error("Error adding expense");
    }
  };


  return (
    <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-4">
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
          const color = [colors.avtar1, colors.avtar2, colors.avtar3, colors.avtar4, colors.avtar5];
          const avatarColor = color[index % color.length];
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
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mt-6 mb-2">
        Who owes whom?
      </Text>
      <View className="flex-row mb-2">
        <TouchableOpacity
          onPress={() => setType("incoming")}
          className={`flex-1 py-4 mr-2 rounded-2xl items-center ${
            type === "incoming"
              ? "bg-green-500/20 border border-green-500/30"
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
            They Owe Me
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("outgoing")}
          className={`flex-1 py-4 ml-2 rounded-2xl items-center ${
            type === "outgoing"
              ? "bg-red-500/20 border border-red-500/30"
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
            I Owe Them
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-neutral-500 text-xs mb-8">
        {type === "incoming" ? "You paid or lent — they need to pay you back" : "They paid or lent — you need to pay them back"}
      </Text>

      {/* Category */}
      {type === "outgoing" && (
        <View className="mb-8">
          <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
            Category
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {CATEGORIES.map((cat) => {
              const selected = category === cat.value;
              return (
                <TouchableOpacity
                  key={cat.value}
                  onPress={() => setCategory(cat.value)}
                  className={`px-4 py-3 rounded-2xl border ${
                    selected
                      ? "bg-white border-white"
                      : "bg-[#0F0F12] border-neutral-800"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selected ? "text-black" : "text-neutral-400"
                    }`}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

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
    </ScrollView>
  );
}
