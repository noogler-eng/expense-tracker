import addTransactionMe from "@/db/helper/txn/addTransactionMe";
import { Category } from "@/types";
import colors from "@/utils/helper/colors";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AddTransaction() {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("others");
  const [type, setType] = useState<"incoming" | "outgoing">("incoming");

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    if (type === "outgoing" && !category) return;

    try {
      const txn = {
        amount: Number(amount),
        description: description || "No description",
        category: type === "outgoing" ? category : "incoming",
        type,
      };

      await addTransactionMe(txn);
      setAmount("");
      setDescription("");
    } catch {
      console.error("Error adding transaction");
    }
  };

  useEffect(() => {
    if (type === "incoming") {
      setCategory("incoming");
    } else {
      setCategory("others");
    }
  }, [type]);

  const CATEGORIES: { label: string; value: Category }[] = [
    { label: "Food", value: "food" },
    { label: "Transport", value: "transport" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Utilities", value: "utilities" },
    { label: "Others", value: "others" },
  ];

  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      {/* Header */}
      <View className="mb-8">
        <Text className="text-white text-3xl font-bold">Add Transaction</Text>
        <Text className="text-neutral-400 text-sm mt-1">
          Record money given or received
        </Text>
      </View>

      {/* Friends */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
        Add Transaction To Yourself!
      </Text>

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
        placeholderTextColor={colors.placeholder}
        className="bg-[#0F0F12] border border-neutral-800 text-white px-5 py-4 rounded-2xl"
      />

      {/* Type */}
      <View className="flex-row mt-6 mb-10">
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

      {type === "outgoing" && (
        <View className="mb-10">
          <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
            Category <Text className="text-red-400">*</Text>
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

          <Text className="text-neutral-500 text-xs mt-3">
            Select where this money was spent
          </Text>
        </View>
      )}

      {/* CTA */}
      <TouchableOpacity
        onPress={handleSave}
        activeOpacity={0.85}
        className="bg-white py-4 mb-8 rounded-2xl items-center"
      >
        <Text className="text-black text-lg font-semibold">Save Expense</Text>
      </TouchableOpacity>
    </View>
  );
}
