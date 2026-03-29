import LastDayBottomSheet from "@/components/bottomsheets/LastDayBottomSheet";
import EditTransactionSheet from "@/components/EditTransactionSheet";
import EntryPoint from "@/components/EntryPoint";
import GlowCard from "@/components/GlowCard";
import Loading from "@/components/Loading";
import { useTheme } from "@/components/ThemeContext";
import Store from "@/db/Store";
import getAppData from "@/db/helper/app/getAppData";
import { AppData } from "@/types";
import QuickAddShortcut from "@/types/helper/shortcutType";
import Friend from "@/types/helper/friendType";
import colors from "@/utils/helper/colors";
import getDaysInMonth from "@/utils/helper/days";
import { useRouter } from "expo-router";
import { Flame, Undo2, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { PieChart } from "react-native-chart-kit";

export default function Index() {
 const router = useRouter();
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const [loading, setLoading] = useState(true);
 const [user, setUser] = useState<any>(null);
 const [history, setHistory] = useState<any>(null);
 const [extra, setExtra] = useState<any>(null);
 const [friendsData, setFriendsData] = useState<Friend[] | null>(null);
 const [showAll, setShowAll] = useState(false);
 const [isOpen, setIsOpen] = useState(true);
 const [shortcuts, setShortcuts] = useState<QuickAddShortcut[]>([]);
 const [streak, setStreak] = useState(0);
 const [budgetWarnings, setBudgetWarnings] = useState<{ category: string; spent: number; limit: number }[]>([]);
 const [suggestion, setSuggestion] = useState<string | null>(null);
 const [editTxn, setEditTxn] = useState<any>(null);
 const [refreshing, setRefreshing] = useState(false);

 const fetchData = async () => {
 try {
 const appData: AppData | undefined = await getAppData();
 if (!appData || !appData.user.firstName || !appData.user.lastName) {
 router.push("/onboarding");
 return;
 }

 setExtra({
 totalIncoming: appData?.totalIncoming || 0,
 totalOutgoing: appData?.totalOutgoing || 0,
 });
 setHistory(appData.user.history || []);
 const friends = appData.friends || [];
 setFriendsData(friends);

 let netBalance = 0;
 let expectedIncome = 0;

 friends.forEach((friend: Friend) => {
 const bal = Number(friend.balance || 0);
 netBalance += bal;
 expectedIncome += bal;
 });

 expectedIncome += appData.user.income ?? 0;

 setUser({
 ...appData.user,
 netBalance,
 expectedIncome,
 });

 // Process recurring expenses on app load
 await Store.processRecurringExpenses();

 // Load shortcuts
 setShortcuts(appData.quickAddShortcuts || []);

 // Calculate spending streak
 const userHistory = appData.user.history || [];
 const outgoing = userHistory.filter((t: any) => t.type === "outgoing");
 if (outgoing.length > 0) {
 const dailyMap: Record<string, number> = {};
 outgoing.forEach((t: any) => {
 const day = new Date(t.date).toISOString().split("T")[0];
 dailyMap[day] = (dailyMap[day] || 0) + t.amount;
 });
 const dailyValues = Object.values(dailyMap);
 const avg = dailyValues.reduce((a, b) => a + b, 0) / dailyValues.length;
 let s = 0;
 for (let i = 0; i < 90; i++) {
 const d = new Date();
 d.setDate(d.getDate() - i);
 const key = d.toISOString().split("T")[0];
 const spent = dailyMap[key] || 0;
 if (spent <= avg) s++;
 else break;
 }
 setStreak(s);
 }

 // Budget warnings
 const budgets = appData.budgets || {};
 const now = new Date();
 const thisMonthTxns = userHistory.filter((t: any) => {
 const d = new Date(t.date);
 return t.type === "outgoing" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
 });
 const catSpend: Record<string, number> = {};
 thisMonthTxns.forEach((t: any) => {
 const cat = t.category || "others";
 catSpend[cat] = (catSpend[cat] || 0) + t.amount;
 });
 const warnings: { category: string; spent: number; limit: number }[] = [];
 Object.entries(budgets).forEach(([cat, limit]) => {
 const spent = catSpend[cat] || 0;
 if (spent >= limit * 0.8) {
 warnings.push({ category: cat, spent, limit });
 }
 });
 setBudgetWarnings(warnings);

 // Smart suggestion based on patterns
 const currentHour = now.getHours();
 const currentDay = now.getDay();
 const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

 const recentOutgoing = userHistory.filter((t: any) => t.type === "outgoing");
 if (recentOutgoing.length >= 5) {
 // Find most common category at this time of day (±2 hours)
 const hourMatches = recentOutgoing.filter((t: any) => {
 const h = new Date(t.date).getHours();
 return Math.abs(h - currentHour) <= 2;
 });

 if (hourMatches.length >= 2) {
 const catCount: Record<string, number> = {};
 hourMatches.forEach((t: any) => { catCount[t.category || "others"] = (catCount[t.category || "others"] || 0) + 1; });
 const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];
 if (topCat && topCat[1] >= 2) {
 setSuggestion(`You usually spend on ${topCat[0]} around this time`);
 }
 }

 // Day-based suggestion
 if (!suggestion) {
 const dayMatches = recentOutgoing.filter((t: any) => new Date(t.date).getDay() === currentDay);
 if (dayMatches.length >= 3) {
 const avg = dayMatches.reduce((s: number, t: any) => s + t.amount, 0) / dayMatches.length;
 setSuggestion(`${WEEKDAYS[currentDay]}s you typically spend ₹${avg.toFixed(0)}`);
 }
 }
 }

 setTimeout(() => setLoading(false), 700);
 } catch (error) {
 console.error(error);
 }
 };

 useEffect(() => {
 setLoading(true);
 fetchData();
 }, []);

 const hasPositiveAlert =
 Array.isArray(friendsData) &&
 friendsData.some((friend) => Number(friend.balance) >= 1000);

 const hasNegativeAlert =
 Array.isArray(friendsData) &&
 friendsData.some((friend) => Number(friend.balance) <= -1000);

 const days =
 getDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1) -
 new Date().getDate();

 const screenWidth = Dimensions.get("window").width;

 const categoryTotals = React.useMemo(() => {
 if (!history || history.length === 0) return [];

 const map: Record<string, number> = {};

 history.forEach((txn: any) => {
 if (txn.type !== "outgoing") return;

 const category = txn.category || "Other";
 map[category] = (map[category] || 0) + Math.abs(txn.amount);
 });

 return Object.entries(map).map(([key, value]) => ({
 name: key,
 amount: value,
 }));
 }, [history]);

 if (loading) {
 return <Loading />;
 }

 const chartData = categoryTotals.map((item, index) => ({
 name: item.name.slice(0, 7) + "...",
 population: item.amount,
 color: [
 colors.chartGreen,
 colors.chartBlue,
 colors.chartOrange,
 colors.chartPurple,
 colors.chartRed,
 ][index % 5],
 legendFontColor: colors.aboutIconColor,
 legendFontSize: 12,
 }));

 const close = () => {
 setIsOpen(false);
 };

 return (
 <>
 <ScrollView
 style={{ backgroundColor: t.bg }}
 className="flex-1 px-6 pt-6"
 refreshControl={
   <RefreshControl
     refreshing={refreshing}
     onRefresh={async () => {
       setRefreshing(true);
       await fetchData();
       setRefreshing(false);
     }}
     tintColor={isDark ? "#fff" : "#000"}
   />
 }
 >
 <View className="items-start mb-6">
 <EntryPoint />
 </View>

 {/* Welcome */}
 <Animatable.View animation="fadeInDown" duration={700}>
 <Text style={{ color: t.textSecondary }} className="text-base">Welcome back,</Text>
 <Text style={{ color: t.text }} className="text-4xl font-bold mt-1">
 {user?.firstName} {user?.lastName}
 </Text>
 </Animatable.View>

 {/* Quick Add Shortcuts */}
 {shortcuts.length > 0 && (
 <Animatable.View animation="fadeInUp" delay={100} duration={600} className="mt-6">
 <Text style={{ color: t.textSecondary }} className="text-xs uppercase tracking-widest mb-3">
 Quick Add
 </Text>
 <ScrollView horizontal showsHorizontalScrollIndicator={false}>
 {shortcuts.map((s) => (
 <TouchableOpacity
 key={s.id}
 activeOpacity={0.8}
 onPress={async () => {
 await Store.executeShortcut(s.id);
 Alert.alert("Added", `${s.label} — ₹${s.amount}`);
 }}
 className="mr-3 px-4 py-3 rounded-2xl border flex-row items-center gap-2"
 >
 <Zap size={14} color="#F59E0B" />
 <Text className="text-white text-sm font-medium">{s.label}</Text>
 <Text style={{ color: t.textMuted }} className="text-xs">₹{s.amount}</Text>
 </TouchableOpacity>
 ))}
 </ScrollView>
 </Animatable.View>
 )}

 {/* Spending Streak + Budget Warnings Row */}
 {(streak > 0 || budgetWarnings.length > 0) && (
 <View className="mt-4 gap-3">
 {streak > 0 && (
 <Animatable.View animation="fadeInLeft" duration={500}>
 <View style={cardStyle} className="rounded-2xl p-4 flex-row items-center gap-3">
 <Flame size={20} color="#F97316" />
 <View>
 <Text style={{ color: t.text }} className="font-bold text-lg">{streak} day streak</Text>
 <Text style={{ color: t.textMuted }} className="text-xs">Under daily average spending</Text>
 </View>
 </View>
 </Animatable.View>
 )}

 {budgetWarnings.map((w) => (
 <Animatable.View key={w.category} animation="fadeInRight" duration={500}>
 <View className={`rounded-2xl p-4 border ${
 w.spent >= w.limit
 ? "bg-red-500/10 border-red-500/30"
 : "bg-yellow-500/10 border-yellow-500/30"
 }`}>
 <Text className={`font-semibold text-sm ${
 w.spent >= w.limit ? "text-red-400" : "text-yellow-400"
 }`}>
 {w.spent >= w.limit ? "🚨" : "⚠️"} {w.category.charAt(0).toUpperCase() + w.category.slice(1)}: ₹{w.spent.toFixed(0)} / ₹{w.limit.toFixed(0)}
 {w.spent >= w.limit ? " — Over budget!" : " — Nearing limit"}
 </Text>
 </View>
 </Animatable.View>
 ))}
 </View>
 )}

 {/* Smart Suggestion */}
 {suggestion && (
 <Animatable.View animation="fadeIn" delay={200} duration={600} className="mt-4">
 <View className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex-row items-center gap-3">
 <Text className="text-lg">💡</Text>
 <Text className="text-blue-300 text-sm flex-1">{suggestion}</Text>
 </View>
 </Animatable.View>
 )}

 {/* Main Balance Card */}
 <Animatable.View
 animation="fadeInUp"
 delay={150}
 duration={800}
 className="mt-10"
 >
 <GlowCard>
 <View style={cardStyle} className="rounded-3xl p-6">
 {/* Net Balance */}
 <View className="mb-8">
 <Text style={{ color: t.textMuted }} className="text-sm">
 Net Balance which will In and Out
 </Text>
 <Text
 className={`text-4xl font-bold mt-2 ${
 user!.netBalance === 0
 ? colors.neutralAmount
 : user!.netBalance > 0
 ? colors.positiveAmount
 : colors.negativeAmount
 }`}
 >
 {user!.netBalance === 0
 ? "₹0.00"
 : user!.netBalance > 0
 ? `₹${user!.netBalance.toFixed(2)}`
 : `₹${Math.abs(user!.netBalance).toFixed(2)}`}
 </Text>
 <Text style={{ color: t.textMuted }} className="text-xs mt-2">
 Overall position based on all friends
 </Text>
 </View>

 {/* Expected Income */}
 <View className="mb-8">
 <Text style={{ color: t.textMuted }} className="text-sm">
 Expected Income (Future Now)
 </Text>
 <Text
 className={`text-4xl font-bold mt-2 ${
 user!.expectedIncome === 0
 ? colors.neutralAmount
 : user!.expectedIncome > 0
 ? colors.positiveAmount
 : colors.negativeAmount
 }`}
 >
 {user!.expectedIncome === 0
 ? "₹0.00"
 : user!.expectedIncome > 0
 ? `₹${user!.expectedIncome.toFixed(2)}`
 : `₹${Math.abs(user!.expectedIncome).toFixed(2)}`}
 </Text>
 <Text style={{ color: t.textMuted }} className="text-xs mt-1">
 Money you should receive from others
 </Text>
 </View>

 {/* Incoming / Outgoing */}
 <View className="flex-row justify-between pt-4 border-t ">
 <View>
 <Text style={{ color: t.textMuted }} className="text-sm">
 Total Incoming
 </Text>
 <Text
 className={
 colors.positiveAmount + " text-xl font-semibold mt-1"
 }
 >
 ₹{extra?.totalIncoming ?? 0}
 </Text>
 </View>

 <View className="items-end">
 <Text style={{ color: t.textMuted }} className="text-sm">
 Total Outgoing
 </Text>
 <Text className="text-red-400 text-xl font-semibold mt-1">
 ₹{extra?.totalOutgoing ?? 0}
 </Text>
 </View>
 </View>
 </View>
 </GlowCard>
 </Animatable.View>

 {/* user income notice coming in certain number of times */}
 <View className="mt-2">
 {typeof user?.income === "number" && user?.income != 0 && (
 <View style={cardStyle} className="rounded-2xl p-4 mb-2">
 <Text className="text-neutral-500 font-semibold">
 Your expected income is ₹{user.income} coming in {days} days!
 </Text>
 </View>
 )}
 </View>

 {/* User transaction list */}
 {history && history.length > 0 ? (
 <Animatable.View
 animation="fadeInUp"
 delay={300}
 duration={800}
 className="mt-10"
 >
 {/* Header */}
 <View className="flex-row justify-between items-center mb-4">
 <View className="flex-row items-center gap-3">
 <Text style={{ color: t.text }} className="text-xl font-semibold">
 Recent Transactions
 </Text>
 <TouchableOpacity
 onPress={async () => {
 Alert.alert("Undo", "Remove your last transaction?", [
 { text: "Cancel" },
 {
 text: "Undo",
 style: "destructive",
 onPress: async () => {
 const removed = await Store.undoLastTransaction();
 if (removed) {
 setHistory((prev: any[]) => prev.slice(0, -1));
 Alert.alert("Done", `Removed: ${removed.description} (₹${removed.amount})`);
 }
 },
 },
 ]);
 }}
 className="bg-neutral-800 px-2 py-1 rounded-lg"
 >
 <Undo2 size={14} color="#A1A1AA" />
 </TouchableOpacity>
 </View>

 {history.length > 3 && (
 <Text
 onPress={() => setShowAll(!showAll)}
 className="text-neutral-400 text-sm"
 >
 {showAll ? "View less" : "View all"}
 </Text>
 )}
 </View>

 {/* Transaction list */}
 <View style={cardStyle} className="rounded-2xl rounded-2xl overflow-hidden">
 {(showAll ? history : [...history].reverse().slice(0, 3)).map(
 (txn: any, index: number) => (
 <TouchableOpacity
 key={index}
 onPress={() => setEditTxn(txn)}
 activeOpacity={0.7}
 className={`p-4 ${
 index !==
 (showAll ? history.length : Math.min(3, history.length)) -
 1
 ? "border-b "
 : ""
 }`}
 >
 <View className="flex-row justify-between items-center">
 <View>
 <Text className="text-white text-base font-medium">
 {txn.description}
 </Text>
 <Text style={{ color: t.textMuted }} className="text-xs mt-1">
 {new Date(txn.date).toLocaleDateString()}
 </Text>
 </View>

 <Text
 className={`text-lg font-semibold ${
 txn.amount === 0
 ? colors.neutralAmount
 : txn.type === "incoming"
 ? colors.positiveAmount
 : colors.negativeAmount
 }`}
 >
 {txn.amount === 0
 ? "₹0.00"
 : txn.amount > 0
 ? `₹${txn.amount.toFixed(2)}`
 : `₹${Math.abs(txn.amount).toFixed(2)}`}
 </Text>
 </View>
 </TouchableOpacity>
 )
 )}
 </View>
 </Animatable.View>
 ) : (
 <Animatable.View
 animation="fadeInUp"
 delay={300}
 duration={800}
 className="mt-10 items-center"
 >
 <Text style={{ color: t.textMuted }} className="text-base">
 No transactions yet. Start by adding a new transaction!
 </Text>
 </Animatable.View>
 )}

 {/* alert card box when friends positive amount is greater then 1000 or less then thousand */}
 <View className="mt-4">
 {hasPositiveAlert && (
 <View style={cardStyle} className="rounded-2xl p-4 mb-2">
 <Text className="text-neutral-500 font-semibold">
 You have friends who owe you more than ₹1000!
 </Text>
 </View>
 )}

 {hasNegativeAlert && (
 <View style={cardStyle} className="rounded-2xl p-4 mb-2">
 <Text className="text-neutral-500 font-semibold">
 You owe friends more than ₹1000!
 </Text>
 </View>
 )}
 </View>

 {categoryTotals.length > 0 && (
 <Animatable.View
 animation="fadeInUp"
 delay={400}
 duration={800}
 className="mt-10"
 >
 <Text style={{ color: t.text }} className="text-xl font-semibold mb-4">
 Spending by Category
 </Text>

 <View style={cardStyle} className="rounded-2xl rounded-2xl py-4">
 <PieChart
 data={chartData}
 width={screenWidth - 48}
 height={220}
 chartConfig={{
 color: () => colors.white,
 labelColor: () => colors.placeholder,
 }}
 accessor="population"
 backgroundColor="transparent"
 paddingLeft="16"
 hasLegend={true}
 avoidFalseZero
 />
 </View>
 </Animatable.View>
 )}

 <View style={cardStyle} className="mt-4 rounded-2xl p-4">
 {categoryTotals.map((item) => (
 <View key={item.name} className="flex-row justify-between mb-3">
 <Text style={{ color: t.textSecondary }} className="text-sm">{item.name}</Text>
 <Text style={{ color: t.text }} className="font-semibold">
 ₹{item.amount.toFixed(2)}
 </Text>
 </View>
 ))}
 </View>

 {/* Footer hint */}
 <Animatable.View animation="fadeIn" delay={700} className="mt-4 mb-20">
 <Text style={{ color: t.textMuted }} className="text-sm text-center">
 Your balance updates automatically as you add or split expenses
 </Text>
 </Animatable.View>
 </ScrollView>
 {editTxn && (
 <EditTransactionSheet
   transaction={editTxn}
   visible={!!editTxn}
   onClose={() => setEditTxn(null)}
   onSaved={fetchData}
 />
 )}
 {isOpen && <LastDayBottomSheet onClose={close} transactions={history} />}
 </>
 );
}
