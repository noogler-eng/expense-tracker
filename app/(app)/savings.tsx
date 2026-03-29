import Store from "@/db/Store";
import SavingsGoal from "@/types/helper/savingsGoalType";
import colors from "@/utils/helper/colors";
import { Target, Trash } from "lucide-react-native";
import { useToast } from "@/components/Toast";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Savings() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const toast = useToast();
 const [goals, setGoals] = useState<SavingsGoal[]>([]);
 const [name, setName] = useState("");
 const [target, setTarget] = useState("");
 const [deadline, setDeadline] = useState("");
 const [addAmounts, setAddAmounts] = useState<Record<string, string>>({});

 const load = async () => setGoals(await Store.getSavingsGoals());
 useEffect(() => { load(); }, []);

 const handleCreate = async () => {
 if (!name.trim() || !target || Number(target) <= 0) {
 Alert.alert("Missing", "Enter a goal name and target amount.");
 return;
 }
 await Store.addSavingsGoal({
 name: name.trim(),
 targetAmount: Number(target),
 deadline: deadline || undefined,
 });
 setName("");
 setTarget("");
 setDeadline("");
 load();
 toast.show("Savings goal added!");
 };

 const handleAdd = async (id: string) => {
 const amt = Number(addAmounts[id]);
 if (!amt || amt <= 0) return;
 await Store.addToSavingsGoal(id, amt);
 setAddAmounts({ ...addAmounts, [id]: "" });
 load();
 };

 const handleDelete = (id: string) => {
 Alert.alert("Delete", "Remove this savings goal?", [
 { text: "Cancel" },
 { text: "Delete", style: "destructive", onPress: async () => { await Store.removeSavingsGoal(id); load(); } },
 ]);
 };

 return (
 <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Savings Goals</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Track your saving targets</Text>
 </View>

 {/* Create form */}
 <View style={cardStyle} className="rounded-2xl p-5 mb-6">
 <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-3">New Goal</Text>

 <TextInput
 value={name}
 onChangeText={setName}
 placeholder="e.g., Emergency Fund, Vacation"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-3"
 />
 <TextInput
 value={target}
 onChangeText={setTarget}
 placeholder="Target amount (₹)"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-3"
 />
 <TextInput
 value={deadline}
 onChangeText={setDeadline}
 placeholder="Deadline (optional, e.g., 2026-12-31)"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-4"
 />

 <TouchableOpacity onPress={handleCreate} activeOpacity={0.85} className="bg-white py-3 rounded-xl items-center">
 <Text className="text-black font-semibold">Create Goal</Text>
 </TouchableOpacity>
 </View>

 {/* Goals */}
 {goals.length === 0 ? (
 <View className="items-center py-12">
 <Target size={32} color="#52525B" />
 <Text style={{ color: t.textMuted }} className="text-sm mt-3">No savings goals yet.</Text>
 </View>
 ) : (
 goals.map((goal, index) => {
 const pct = goal.targetAmount > 0 ? Math.min((goal.savedAmount / goal.targetAmount) * 100, 100) : 0;
 const remaining = Math.max(goal.targetAmount - goal.savedAmount, 0);
 const isComplete = goal.savedAmount >= goal.targetAmount;

 let barColor = colors.chartBlue;
 if (pct >= 100) barColor = colors.chartGreen;
 else if (pct >= 50) barColor = "#F59E0B";

 const daysLeft = goal.deadline
 ? Math.max(Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / 86400000), 0)
 : null;

 return (
 <Animatable.View key={goal.id} animation="fadeInUp" delay={index * 80} duration={500} className="mb-4">
 <View style={cardStyle} className="rounded-2xl p-5">
 <View className="flex-row justify-between items-start mb-3">
 <View className="flex-1">
 <Text style={{ color: t.text }} className="text-lg font-bold">{goal.name}</Text>
 {daysLeft !== null && (
 <Text style={{ color: t.textMuted }} className="text-xs mt-1">
 {isComplete ? "Goal reached!" : `${daysLeft} days left`}
 </Text>
 )}
 </View>
 <TouchableOpacity onPress={() => handleDelete(goal.id)}>
 <Trash size={16} color={colors.trash} />
 </TouchableOpacity>
 </View>

 {/* Progress */}
 <View className="flex-row justify-between mb-2">
 <Text className="text-green-400 text-sm font-semibold">₹{goal.savedAmount.toFixed(0)}</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm">₹{goal.targetAmount.toFixed(0)}</Text>
 </View>

 <View className="h-3 bg-neutral-800 rounded-full overflow-hidden mb-2">
 <View
 style={{ width: `${pct}%`, backgroundColor: barColor }}
 className="h-full rounded-full"
 />
 </View>

 <Text style={{ color: t.textMuted }} className="text-xs mb-4">
 {isComplete ? "🎉 Congratulations!" : `₹${remaining.toFixed(0)} to go (${pct.toFixed(0)}%)`}
 </Text>

 {/* Quick add */}
 {!isComplete && (
 <View className="flex-row gap-2">
 <TextInput
 value={addAmounts[goal.id] || ""}
 onChangeText={(t) => setAddAmounts({ ...addAmounts, [goal.id]: t })}
 placeholder="Add ₹"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="flex-1 px-4 py-2 rounded-xl"
 />
 <TouchableOpacity
 onPress={() => handleAdd(goal.id)}
 className="bg-green-500 px-5 py-2 rounded-xl items-center justify-center"
 >
 <Text className="text-black font-semibold text-sm">Save</Text>
 </TouchableOpacity>
 </View>
 )}
 </View>
 </Animatable.View>
 );
 })
 )}

 <View className="h-20" />
 </ScrollView>
 );
}
