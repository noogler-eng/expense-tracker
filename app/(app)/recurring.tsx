import Store from "@/db/Store";
import { Category } from "@/types";
import RecurringExpense from "@/types/helper/recurringType";
import colors from "@/utils/helper/colors";
import { Trash } from "lucide-react-native";
import { useToast } from "@/components/Toast";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import {
 Alert,
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

const FREQUENCIES = ["daily", "weekly", "monthly"] as const;

export default function Recurring() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const toast = useToast();
 const [items, setItems] = useState<RecurringExpense[]>([]);
 const [description, setDescription] = useState("");
 const [amount, setAmount] = useState("");
 const [category, setCategory] = useState<Category>("utilities");
 const [type, setType] = useState<"incoming" | "outgoing">("outgoing");
 const [frequency, setFrequency] = useState<"daily" | "weekly" | "monthly">("monthly");
 const [dayOfMonth, setDayOfMonth] = useState("1");

 const load = async () => {
 setItems(await Store.getRecurringExpenses());
 };

 useEffect(() => { load(); }, []);

 const handleAdd = async () => {
 if (!description.trim() || !amount || Number(amount) <= 0) {
 Alert.alert("Missing", "Enter description and amount.");
 return;
 }
 await Store.addRecurringExpense({
 amount: Number(amount),
 description: description.trim(),
 category,
 type,
 frequency,
 dayOfMonth: frequency === "monthly" ? Number(dayOfMonth) || 1 : undefined,
 });
 setDescription("");
 setAmount("");
 load();
 toast.show("Recurring expense created.");
 };

 const handleDelete = async (id: string) => {
 Alert.alert("Delete", "Remove this recurring expense?", [
 { text: "Cancel" },
 { text: "Delete", style: "destructive", onPress: async () => { await Store.removeRecurringExpense(id); load(); } },
 ]);
 };

 return (
 <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Recurring</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">
 Auto-add rent, subscriptions, EMIs
 </Text>
 </View>

 {/* Form */}
 <View style={cardStyle} className="rounded-2xl p-5 mb-6">
 <Text style={{ color: t.textSecondary }} className="text-xs mb-1 ml-1">Description</Text>
 <TextInput
 value={description}
 onChangeText={setDescription}
 placeholder="e.g., Rent, Netflix, EMI"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-4"
 />

 <Text style={{ color: t.textSecondary }} className="text-xs mb-1 ml-1">Amount</Text>
 <TextInput
 value={amount}
 onChangeText={setAmount}
 placeholder="Enter amount"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-4"
 />

 {/* Type */}
 <View className="flex-row mb-4">
 <TouchableOpacity
 onPress={() => setType("outgoing")}
 className={`flex-1 py-3 mr-2 rounded-xl items-center ${type === "outgoing" ? "bg-red-500/20" : ""}`}
 >
 <Text className={`font-semibold text-sm ${type === "outgoing" ? "text-red-400" : "text-neutral-400"}`}>Expense</Text>
 </TouchableOpacity>
 <TouchableOpacity
 onPress={() => setType("incoming")}
 className={`flex-1 py-3 ml-2 rounded-xl items-center ${type === "incoming" ? "bg-green-500/20" : ""}`}
 >
 <Text className={`font-semibold text-sm ${type === "incoming" ? "text-green-400" : "text-neutral-400"}`}>Income</Text>
 </TouchableOpacity>
 </View>

 {/* Frequency */}
 <Text style={{ color: t.textSecondary }} className="text-xs mb-2 ml-1">Frequency</Text>
 <View className="flex-row mb-4 gap-2">
 {FREQUENCIES.map((f) => (
 <TouchableOpacity
 key={f}
 onPress={() => setFrequency(f)}
 className={`flex-1 py-3 rounded-xl items-center border ${
 frequency === f ? "bg-white border-white" : " "
 }`}
 >
 <Text className={`text-sm font-semibold ${frequency === f ? "text-black" : "text-neutral-400"}`}>
 {f.charAt(0).toUpperCase() + f.slice(1)}
 </Text>
 </TouchableOpacity>
 ))}
 </View>

 {/* Day of month */}
 {frequency === "monthly" && (
 <View className="mb-4">
 <Text style={{ color: t.textSecondary }} className="text-xs mb-1 ml-1">Day of Month (1-31)</Text>
 <TextInput
 value={dayOfMonth}
 onChangeText={setDayOfMonth}
 keyboardType="numeric"
 maxLength={2}
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl"
 />
 </View>
 )}

 {/* Category */}
 {type === "outgoing" && (
 <View className="mb-4">
 <Text style={{ color: t.textSecondary }} className="text-xs mb-2 ml-1">Category</Text>
 <View className="flex-row flex-wrap gap-2">
 {CATEGORIES.map((cat) => {
 const selected = category === cat.value;
 return (
 <TouchableOpacity
 key={cat.value}
 onPress={() => setCategory(cat.value)}
 className={`px-3 py-2 rounded-xl border ${selected ? "bg-white border-white" : " "}`}
 >
 <Text className={`text-xs font-semibold ${selected ? "text-black" : "text-neutral-400"}`}>{cat.label}</Text>
 </TouchableOpacity>
 );
 })}
 </View>
 </View>
 )}

 <TouchableOpacity onPress={handleAdd} activeOpacity={0.85} className="bg-white py-3 rounded-xl items-center">
 <Text className="text-black font-semibold">Add Recurring</Text>
 </TouchableOpacity>
 </View>

 {/* List */}
 <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-3">Active Recurring</Text>

 {items.length === 0 ? (
 <Text style={{ color: t.textMuted }} className="text-sm text-center py-8">No recurring expenses yet.</Text>
 ) : (
 items.map((item, index) => (
 <Animatable.View key={item.id} animation="fadeInUp" delay={index * 60} duration={400} className="mb-3">
 <View style={cardStyle} className="flex-row items-center justify-between rounded-2xl px-4 py-4">
 <View className="flex-1">
 <Text style={{ color: t.text }} className="font-medium">{item.description}</Text>
 <Text style={{ color: t.textMuted }} className="text-xs mt-1">
 ₹{item.amount} · {item.frequency}{item.frequency === "monthly" ? ` (day ${item.dayOfMonth})` : ""} · {item.category}
 </Text>
 </View>
 <View className="flex-row items-center gap-3">
 <Text className={`text-sm font-bold ${item.type === "incoming" ? "text-green-400" : "text-red-400"}`}>
 {item.type === "incoming" ? "+" : "-"}₹{item.amount}
 </Text>
 <TouchableOpacity onPress={() => handleDelete(item.id)}>
 <Trash size={16} color={colors.trash} />
 </TouchableOpacity>
 </View>
 </View>
 </Animatable.View>
 ))
 )}

 <View className="h-20" />
 </ScrollView>
 );
}
