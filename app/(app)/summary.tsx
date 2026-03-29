import Store from "@/db/Store";
import { Transaction } from "@/types";
import colors from "@/utils/helper/colors";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react-native";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Share, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function Summary() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const [history, setHistory] = useState<Transaction[]>([]);
 const [month, setMonth] = useState(new Date().getMonth());
 const [year, setYear] = useState(new Date().getFullYear());

 useEffect(() => {
 const load = async () => {
 const data = await Store.getData();
 setHistory(data.user.history || []);
 };
 load();
 }, []);

 const prev = () => {
 if (month === 0) { setMonth(11); setYear(year - 1); }
 else setMonth(month - 1);
 };
 const next = () => {
 if (month === 11) { setMonth(0); setYear(year + 1); }
 else setMonth(month + 1);
 };

 const filterMonth = (m: number, y: number) =>
 history.filter((t) => {
 const d = new Date(t.date);
 return d.getMonth() === m && d.getFullYear() === y;
 });

 const current = useMemo(() => filterMonth(month, year), [history, month, year]);
 const previous = useMemo(() => {
 const pm = month === 0 ? 11 : month - 1;
 const py = month === 0 ? year - 1 : year;
 return filterMonth(pm, py);
 }, [history, month, year]);

 const calc = (txns: Transaction[]) => {
 let incoming = 0, outgoing = 0;
 txns.forEach((t) => {
 if (t.type === "incoming") incoming += t.amount;
 else outgoing += t.amount;
 });
 return { incoming, outgoing, net: incoming - outgoing };
 };

 const cur = calc(current);
 const prev_ = calc(previous);

 const pctChange = prev_.outgoing > 0
 ? ((cur.outgoing - prev_.outgoing) / prev_.outgoing * 100)
 : 0;

 // Category breakdown
 const categories = useMemo(() => {
 const map: Record<string, number> = {};
 let total = 0;
 current.filter((t) => t.type === "outgoing").forEach((t) => {
 const cat = t.category || "others";
 map[cat] = (map[cat] || 0) + t.amount;
 total += t.amount;
 });
 return Object.entries(map)
 .sort((a, b) => b[1] - a[1])
 .map(([name, amount]) => ({ name, amount, pct: total > 0 ? (amount / total) * 100 : 0 }));
 }, [current]);

 // Daily average
 const daysInMonth = new Date(year, month + 1, 0).getDate();
 const daysPassed = year === new Date().getFullYear() && month === new Date().getMonth()
 ? new Date().getDate()
 : daysInMonth;
 const dailyAvg = daysPassed > 0 ? cur.outgoing / daysPassed : 0;

 // Highest spending day
 const highestDay = useMemo(() => {
 const map: Record<string, number> = {};
 current.filter((t) => t.type === "outgoing").forEach((t) => {
 const day = new Date(t.date).getDate().toString();
 map[day] = (map[day] || 0) + t.amount;
 });
 let max = { day: "—", amount: 0 };
 Object.entries(map).forEach(([day, amt]) => {
 if (amt > max.amount) max = { day, amount: amt };
 });
 return max;
 }, [current]);

 const shareReport = async () => {
 const catText = categories.map((c) => ` • ${c.name}: ₹${c.amount.toFixed(0)}`).join("\n");
 const msg = `📊 ${MONTHS[month]} ${year} — Expense Report

💰 Income: ₹${cur.incoming.toFixed(0)}
💸 Spent: ₹${cur.outgoing.toFixed(0)}
📈 Net: ${cur.net >= 0 ? "+" : ""}₹${cur.net.toFixed(0)}

📅 Daily Average: ₹${dailyAvg.toFixed(0)}
🔥 Highest Day: ${highestDay.day !== "—" ? `${highestDay.day}th (₹${highestDay.amount.toFixed(0)})` : "—"}

📂 By Category:
${catText || " No spending data"}

— Sent from Resolve`;

 await Share.share({ message: msg });
 };

 const barColors = [colors.chartBlue, colors.chartGreen, colors.chartOrange, colors.chartPurple, colors.chartRed];

 return (
 <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Summary</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Monthly spending overview</Text>
 </View>

 {/* Month Selector */}
 <View className="flex-row items-center justify-between mb-6">
 <TouchableOpacity onPress={prev} className="p-2">
 <ChevronLeft size={24} color="#fff" />
 </TouchableOpacity>
 <Text style={{ color: t.text }} className="text-xl font-bold">{MONTHS[month]} {year}</Text>
 <View className="flex-row items-center gap-2">
 <TouchableOpacity onPress={shareReport} className="p-2">
 <Share2 size={18} color="#A1A1AA" />
 </TouchableOpacity>
 <TouchableOpacity onPress={next} className="p-2">
 <ChevronRight size={24} color="#fff" />
 </TouchableOpacity>
 </View>
 </View>

 {/* Overview */}
 <Animatable.View animation="fadeInUp" duration={500}>
 <View style={cardStyle} className="rounded-2xl p-5 mb-4">
 <View className="flex-row justify-between mb-4">
 <View>
 <Text style={{ color: t.textMuted }} className="text-xs">Incoming</Text>
 <Text className="text-green-400 text-xl font-bold mt-1">₹{cur.incoming.toFixed(0)}</Text>
 </View>
 <View className="items-end">
 <Text style={{ color: t.textMuted }} className="text-xs">Outgoing</Text>
 <Text className="text-red-400 text-xl font-bold mt-1">₹{cur.outgoing.toFixed(0)}</Text>
 </View>
 </View>
 <View className="border-t pt-3">
 <Text style={{ color: t.textMuted }} className="text-xs">Net</Text>
 <Text className={`text-2xl font-bold mt-1 ${cur.net >= 0 ? "text-green-400" : "text-red-400"}`}>
 {cur.net >= 0 ? "+" : ""}₹{cur.net.toFixed(0)}
 </Text>
 </View>
 </View>
 </Animatable.View>

 {/* Comparison */}
 {prev_.outgoing > 0 && (
 <Animatable.View animation="fadeInUp" delay={100} duration={500}>
 <View className={`rounded-2xl p-4 mb-4 border ${
 pctChange <= 0 ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"
 }`}>
 <Text className={`font-semibold text-sm ${pctChange <= 0 ? "text-green-400" : "text-red-400"}`}>
 {pctChange <= 0 ? "📉" : "📈"} {Math.abs(pctChange).toFixed(1)}% {pctChange <= 0 ? "less" : "more"} than {MONTHS[month === 0 ? 11 : month - 1]}
 </Text>
 </View>
 </Animatable.View>
 )}

 {/* Stats Row */}
 <View className="flex-row gap-3 mb-4">
 <View style={cardStyle} className="flex-1 rounded-2xl p-4">
 <Text style={{ color: t.textMuted }} className="text-xs">Daily Avg</Text>
 <Text style={{ color: t.text }} className="text-lg font-bold mt-1">₹{dailyAvg.toFixed(0)}</Text>
 </View>
 <View style={cardStyle} className="flex-1 rounded-2xl p-4">
 <Text style={{ color: t.textMuted }} className="text-xs">Highest Day</Text>
 <Text style={{ color: t.text }} className="text-lg font-bold mt-1">
 {highestDay.day !== "—" ? `${highestDay.day}th` : "—"}
 </Text>
 {highestDay.amount > 0 && (
 <Text className="text-red-400 text-xs mt-1">₹{highestDay.amount.toFixed(0)}</Text>
 )}
 </View>
 </View>

 {/* Category Breakdown */}
 {categories.length > 0 && (
 <Animatable.View animation="fadeInUp" delay={200} duration={500}>
 <Text style={{ color: t.text }} className="text-lg font-semibold mb-3">By Category</Text>
 <View style={cardStyle} className="rounded-2xl p-4">
 {categories.map((cat, i) => (
 <View key={cat.name} className="mb-4">
 <View className="flex-row justify-between mb-1">
 <Text style={{ color: t.textSecondary }} className="text-sm">{cat.name.charAt(0).toUpperCase() + cat.name.slice(1)}</Text>
 <Text style={{ color: t.text }} className="font-semibold text-sm">₹{cat.amount.toFixed(0)}</Text>
 </View>
 <View className="h-2 bg-neutral-800 rounded-full overflow-hidden">
 <View
 style={{ width: `${cat.pct}%`, backgroundColor: barColors[i % barColors.length] }}
 className="h-full rounded-full"
 />
 </View>
 </View>
 ))}
 </View>
 </Animatable.View>
 )}

 {current.length === 0 && (
 <View className="items-center py-12">
 <Text className="text-neutral-500">No transactions this month.</Text>
 </View>
 )}

 <View className="h-20" />
 </ScrollView>
 );
}
