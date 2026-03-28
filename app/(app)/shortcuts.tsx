import Store from "@/db/Store";
import { Category } from "@/types";
import QuickAddShortcut from "@/types/helper/shortcutType";
import colors from "@/utils/helper/colors";
import { Trash, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Utilities", value: "utilities" },
  { label: "Others", value: "others" },
];

export default function Shortcuts() {
  const [shortcuts, setShortcuts] = useState<QuickAddShortcut[]>([]);
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [type, setType] = useState<"incoming" | "outgoing">("outgoing");

  const load = async () => {
    const data = await Store.getShortcuts();
    setShortcuts(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async () => {
    if (!label.trim() || !amount || Number(amount) <= 0) {
      Alert.alert("Missing", "Enter a label and amount.");
      return;
    }

    await Store.addShortcut({
      label: label.trim(),
      amount: Number(amount),
      category,
      type,
    });

    setLabel("");
    setAmount("");
    setCategory("food");
    load();
    Alert.alert("Added", `"${label.trim()}" shortcut created.`);
  };

  const handleDelete = async (id: string) => {
    await Store.removeShortcut(id);
    load();
  };

  return (
    <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      {/* Header */}
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold">Quick Add</Text>
        <Text className="text-neutral-400 text-sm mt-1">
          One-tap shortcuts for frequent expenses
        </Text>
      </View>

      {/* Form */}
      <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-5 mb-6">
        <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
          Create Shortcut
        </Text>

        <Text className="text-neutral-400 text-xs mb-1 ml-1">Label</Text>
        <TextInput
          value={label}
          onChangeText={setLabel}
          placeholder="e.g., Coffee, Auto, Lunch"
          placeholderTextColor="#6B7280"
          className="bg-[#18181B] border border-neutral-800 text-white px-4 py-3 rounded-xl mb-4"
        />

        <Text className="text-neutral-400 text-xs mb-1 ml-1">Amount</Text>
        <TextInput
          value={amount}
          onChangeText={setAmount}
          placeholder="e.g., 50"
          keyboardType="numeric"
          placeholderTextColor="#6B7280"
          className="bg-[#18181B] border border-neutral-800 text-white px-4 py-3 rounded-xl mb-4"
        />

        {/* Type */}
        <View className="flex-row mb-4">
          <TouchableOpacity
            onPress={() => setType("outgoing")}
            className={`flex-1 py-3 mr-2 rounded-xl items-center ${
              type === "outgoing" ? "bg-red-500/20" : "bg-[#18181B]"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                type === "outgoing" ? "text-red-400" : "text-neutral-400"
              }`}
            >
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType("incoming")}
            className={`flex-1 py-3 ml-2 rounded-xl items-center ${
              type === "incoming" ? "bg-green-500/20" : "bg-[#18181B]"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                type === "incoming" ? "text-green-400" : "text-neutral-400"
              }`}
            >
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category */}
        {type === "outgoing" && (
          <View className="mb-4">
            <Text className="text-neutral-400 text-xs mb-2 ml-1">Category</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const selected = category === cat.value;
                return (
                  <TouchableOpacity
                    key={cat.value}
                    onPress={() => setCategory(cat.value)}
                    className={`px-3 py-2 rounded-xl border ${
                      selected
                        ? "bg-white border-white"
                        : "bg-[#18181B] border-neutral-800"
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
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

        <TouchableOpacity
          onPress={handleAdd}
          activeOpacity={0.85}
          className="bg-white py-3 rounded-xl items-center"
        >
          <Text className="text-black font-semibold">Create Shortcut</Text>
        </TouchableOpacity>
      </View>

      {/* Existing Shortcuts */}
      <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">
        Your Shortcuts
      </Text>

      {shortcuts.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-neutral-500 text-sm">
            No shortcuts yet. Create one above!
          </Text>
        </View>
      ) : (
        shortcuts.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            delay={index * 60}
            duration={400}
            className="mb-3"
          >
            <View className="flex-row items-center justify-between bg-[#0F0F12] border border-neutral-800 rounded-2xl px-4 py-4">
              <View className="flex-row items-center gap-3">
                <Zap size={16} color="#F59E0B" />
                <View>
                  <Text className="text-white font-medium">{item.label}</Text>
                  <Text className="text-neutral-500 text-xs mt-1">
                    ₹{item.amount} · {item.category} · {item.type}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Trash size={16} color={colors.trash} />
              </TouchableOpacity>
            </View>
          </Animatable.View>
        ))
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
