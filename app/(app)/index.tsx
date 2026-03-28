import LastDayBottomSheet from "@/components/bottomsheets/LastDayBottomSheet";
import EntryPoint from "@/components/EntryPoint";
import GlowCard from "@/components/GlowCard";
import Loading from "@/components/Loading";
import Store from "@/db/Store";
import getAppData from "@/db/helper/app/getAppData";
import { AppData } from "@/types";
import QuickAddShortcut from "@/types/helper/shortcutType";
import Friend from "@/types/helper/friendType";
import colors from "@/utils/helper/colors";
import getDaysInMonth from "@/utils/helper/days";
import { useRouter } from "expo-router";
import { Flame, Zap } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Dimensions, ScrollView, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";
import { PieChart } from "react-native-chart-kit";

export default function Index() {
  const router = useRouter();
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

  useEffect(() => {
    setLoading(true);

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

        setTimeout(() => setLoading(false), 700);
      } catch (error) {
        console.error(error);
      }
    };

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
      <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-6">
        <View className="items-start mb-6">
          <EntryPoint />
        </View>

        {/* Welcome */}
        <Animatable.View animation="fadeInDown" duration={700}>
          <Text className="text-neutral-400 text-base">Welcome back 🎃,</Text>
          <Text className="text-white text-4xl font-bold mt-1">
            {user?.firstName} {user?.lastName}
          </Text>
        </Animatable.View>

        {/* Quick Add Shortcuts */}
        {shortcuts.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={100} duration={600} className="mt-6">
            <Text className="text-neutral-400 text-xs uppercase tracking-widest mb-3">
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
                  className="mr-3 px-4 py-3 rounded-2xl border border-neutral-800 bg-[#0F0F12] flex-row items-center gap-2"
                >
                  <Zap size={14} color="#F59E0B" />
                  <Text className="text-white text-sm font-medium">{s.label}</Text>
                  <Text className="text-neutral-500 text-xs">₹{s.amount}</Text>
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
                <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4 flex-row items-center gap-3">
                  <Flame size={20} color="#F97316" />
                  <View>
                    <Text className="text-white font-bold text-lg">{streak} day streak</Text>
                    <Text className="text-neutral-500 text-xs">Under daily average spending</Text>
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

        {/* Main Balance Card */}
        <Animatable.View
          animation="fadeInUp"
          delay={150}
          duration={800}
          className="mt-10"
        >
          <GlowCard>
            <View className="bg-[#0F0F12] border border-neutral-800 rounded-3xl p-6">
              {/* Net Balance */}
              <View className="mb-8">
                <Text className="text-neutral-500 text-sm">
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
                <Text className="text-neutral-500 text-xs mt-2">
                  Overall position based on all friends
                </Text>
              </View>

              {/* Expected Income */}
              <View className="mb-8">
                <Text className="text-neutral-500 text-sm">
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
                <Text className="text-neutral-500 text-xs mt-1">
                  Money you should receive from others
                </Text>
              </View>

              {/* Incoming / Outgoing */}
              <View className="flex-row justify-between pt-4 border-t border-neutral-800">
                <View>
                  <Text className="text-neutral-500 text-sm">
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
                  <Text className="text-neutral-500 text-sm">
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
            <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4 mb-2">
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
              <Text className="text-white text-xl font-semibold">
                Recent Transactions
              </Text>

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
            <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl overflow-hidden">
              {(showAll ? history : [...history].reverse().slice(0, 3)).map(
                (txn: any, index: number) => (
                  <View
                    key={index}
                    className={`p-4 ${
                      index !==
                      (showAll ? history.length : Math.min(3, history.length)) -
                        1
                        ? "border-b border-neutral-800"
                        : ""
                    }`}
                  >
                    <View className="flex-row justify-between items-center">
                      <View>
                        <Text className="text-white text-base font-medium">
                          {txn.description}
                        </Text>
                        <Text className="text-neutral-500 text-xs mt-1">
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
                  </View>
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
            <Text className="text-neutral-500 text-base">
              No transactions yet. Start by adding a new transaction!
            </Text>
          </Animatable.View>
        )}

        {/* alert card box when friends positive amount is greater then 1000 or less then thousand */}
        <View className="mt-4">
          {hasPositiveAlert && (
            <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4 mb-2">
              <Text className="text-neutral-500 font-semibold">
                You have friends who owe you more than ₹1000!
              </Text>
            </View>
          )}

          {hasNegativeAlert && (
            <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4 mb-2">
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
            <Text className="text-white text-xl font-semibold mb-4">
              Spending by Category
            </Text>

            <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl py-4">
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

        <View className="mt-4 bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4">
          {categoryTotals.map((item) => (
            <View key={item.name} className="flex-row justify-between mb-3">
              <Text className="text-neutral-400 text-sm">{item.name}</Text>
              <Text className="text-white font-semibold">
                ₹{item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Footer hint */}
        <Animatable.View animation="fadeIn" delay={700} className="mt-4 mb-20">
          <Text className="text-neutral-500 text-sm text-center">
            Your balance updates automatically as you add or split expenses
          </Text>
        </Animatable.View>
      </ScrollView>
      {isOpen && <LastDayBottomSheet onClose={close} transactions={history} />}
    </>
  );
}
