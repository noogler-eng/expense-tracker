import Store from "@/db/Store";
import { Category } from "@/types";
import Transaction from "@/types/helper/transactionType";
import { useTheme } from "./ThemeContext";
import { useToast } from "./Toast";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Utilities", value: "utilities" },
  { label: "Others", value: "others" },
];

interface Props {
  transaction: Transaction;
  personId?: string;
  visible: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function EditTransactionSheet({ transaction, personId, visible, onClose, onSaved }: Props) {
  const { colors: t, cardStyle, inputStyle } = useTheme();
  const toast = useToast();
  const [amount, setAmount] = useState(String(transaction.amount));
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState<Category>(transaction.category || "others");

  const handleSave = async () => {
    const newAmount = Number(amount);
    if (!newAmount || newAmount <= 0) return;

    await Store.updateAnyTransaction({
      id: transaction.id,
      personId,
      updates: {
        amount: newAmount,
        description: description || "No description",
        category,
      },
    });

    toast.show("Transaction updated");
    onSaved();
    onClose();
  };

  const handleDelete = async () => {
    await Store.removeTransaction({ id: transaction.id, personId });
    toast.show("Transaction deleted", "error");
    onSaved();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <View style={{ backgroundColor: t.bg, borderTopLeftRadius: 24, borderTopRightRadius: 24 }} className="p-6 pb-10">
          <View className="w-12 h-1 bg-neutral-600 rounded-full self-center mb-6" />

          <Text style={{ color: t.text }} className="text-xl font-bold mb-6">Edit Transaction</Text>

          <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-2">Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            style={inputStyle}
            className="px-4 py-3 rounded-xl mb-4"
          />

          <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-2">Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            style={inputStyle}
            className="px-4 py-3 rounded-xl mb-4"
          />

          {transaction.type === "outgoing" && (
            <>
              <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-2">Category</Text>
              <View className="flex-row flex-wrap gap-2 mb-6">
                {CATEGORIES.map((cat) => {
                  const selected = category === cat.value;
                  return (
                    <TouchableOpacity
                      key={cat.value}
                      onPress={() => setCategory(cat.value)}
                      className={`px-3 py-2 rounded-xl border ${
                        selected ? "bg-white border-white" : "border-neutral-700"
                      }`}
                    >
                      <Text className={`text-xs font-semibold ${selected ? "text-black" : "text-neutral-400"}`}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleDelete}
              className="flex-1 py-4 rounded-2xl items-center bg-red-500/10 border border-red-500/30"
            >
              <Text className="text-red-400 font-semibold">Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              activeOpacity={0.85}
              className="flex-1 py-4 rounded-2xl items-center bg-white"
            >
              <Text className="text-black font-semibold">Save</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} className="mt-4 py-3 items-center">
            <Text style={{ color: t.textSecondary }} className="font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
