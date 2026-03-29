import Store from "@/db/Store";
import colors from "@/utils/helper/colors";
import { useToast } from "@/components/Toast";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

const CATEGORIES = [
 { key: "food", label: "Food", color: colors.chartGreen },
 { key: "transport", label: "Transport", color: colors.chartBlue },
 { key: "entertainment", label: "Entertainment", color: colors.chartOrange },
 { key: "utilities", label: "Utilities", color: colors.chartPurple },
 { key: "others", label: "Others", color: colors.chartRed },
];

export default function Budgets() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const toast = useToast();
 const [budgets, setBudgets] = useState<Record<string, string>>({});
 const [spending, setSpending] = useState<Record<string, number>>({});

 useEffect(() => {
 const load = async () => {
 const data = await Store.getData();
 const saved = data.budgets || {};
 const b: Record<string, string> = {};
 Object.entries(saved).forEach(([k, v]) => { b[k] = String(v); });
 setBudgets(b);

 const now = new Date();
 const thisMonth = (data.user.history || []).filter((t) => {
 const d = new Date(t.date);
 return t.type === "outgoing" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
 });
 const s: Record<string, number> = {};
 thisMonth.forEach((t) => {
 const cat = t.category || "others";
 s[cat] = (s[cat] || 0) + t.amount;
 });
 setSpending(s);
 };
 load();
 }, []);

 const handleSave = async () => {
 for (const cat of CATEGORIES) {
 const val = Number(budgets[cat.key]);
 if (val > 0) {
 await Store.setBudget(cat.key, val);
 } else {
 await Store.removeBudget(cat.key);
 }
 }
 toast.show("Budget limits updated.");
 };

 return (
 <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Budgets</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Set monthly spending limits</Text>
 </View>

 {CATEGORIES.map((cat, index) => {
 const spent = spending[cat.key] || 0;
 const limit = Number(budgets[cat.key]) || 0;
 const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
 const overBudget = limit > 0 && spent > limit;
 const nearBudget = limit > 0 && spent >= limit * 0.75 && !overBudget;

 let barColor = cat.color;
 if (overBudget) barColor = "#EF4444";
 else if (nearBudget) barColor = "#EAB308";

 return (
 <Animatable.View key={cat.key} animation="fadeInUp" delay={index * 80} duration={500} className="mb-4">
 <View style={cardStyle} className="rounded-2xl p-4">
 <View className="flex-row justify-between items-center mb-2">
 <View className="flex-row items-center gap-2">
 <View style={{ backgroundColor: cat.color }} className="w-3 h-3 rounded-full" />
 <Text style={{ color: t.text }} className="font-semibold">{cat.label}</Text>
 </View>
 {overBudget && (
 <View className="bg-red-500/20 px-2 py-1 rounded-lg">
 <Text className="text-red-400 text-xs font-bold">Over budget!</Text>
 </View>
 )}
 </View>

 {/* Progress bar */}
 <View className="h-2 bg-neutral-800 rounded-full overflow-hidden mb-3">
 <View
 style={{ width: `${pct}%`, backgroundColor: barColor }}
 className="h-full rounded-full"
 />
 </View>

 <View className="flex-row justify-between items-center">
 <Text style={{ color: t.textMuted }} className="text-xs">
 Spent: <Text style={{ color: t.text }} className="font-semibold">₹{spent.toFixed(0)}</Text>
 {limit > 0 ? ` / ₹${limit.toFixed(0)}` : ""}
 </Text>
 </View>

 {/* Budget input */}
 <View className="mt-3">
 <Text style={{ color: t.textSecondary }} className="text-xs mb-1">Monthly limit</Text>
 <TextInput
 value={budgets[cat.key] || ""}
 onChangeText={(t) => setBudgets({ ...budgets, [cat.key]: t })}
 placeholder="Set limit"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl"
 />
 </View>
 </View>
 </Animatable.View>
 );
 })}

 <TouchableOpacity onPress={handleSave} activeOpacity={0.85} className="bg-white py-4 rounded-2xl items-center mb-8">
 <Text className="text-black text-lg font-semibold">Save Budgets</Text>
 </TouchableOpacity>

 <View className="h-20" />
 </ScrollView>
 );
}
