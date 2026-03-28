import Store from "@/db/Store";
import { Transaction } from "@/types";
import colors from "@/utils/helper/colors";
import { Flame, TrendingDown, TrendingUp } from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CAT_COLORS: Record<string, string> = {
  food: colors.chartGreen,
  transport: colors.chartBlue,
  entertainment: colors.chartOrange,
  utilities: colors.chartPurple,
  others: colors.chartRed,
};

export default function Insights() {
  const [history, setHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await Store.getData();
      setHistory(data.user.history || []);
    };
    load();
  }, []);

  const outgoing = history.filter((t) => t.type === "outgoing");

  // ============ SECTION 1: SPENDING STREAK ============
  const streak = useMemo(() => {
    if (outgoing.length === 0) return 0;

    const dailyMap: Record<string, number> = {};
    outgoing.forEach((t) => {
      const key = new Date(t.date).toISOString().split("T")[0];
      dailyMap[key] = (dailyMap[key] || 0) + t.amount;
    });

    const vals = Object.values(dailyMap);
    if (vals.length === 0) return 0;
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;

    let count = 0;
    for (let i = 0; i < 90; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      const spent = dailyMap[key] || 0;
      if (spent <= avg) count++;
      else break;
    }
    return count;
  }, [outgoing]);

  // ============ SECTION 2: TOP SPENDING DAYS ============
  const weekdayData = useMemo(() => {
    const map: Record<number, number> = {};
    for (let i = 0; i < 7; i++) map[i] = 0;

    outgoing.forEach((t) => {
      const day = new Date(t.date).getDay();
      map[day] += t.amount;
    });

    const max = Math.max(...Object.values(map), 1);
    return Object.entries(map).map(([day, amount]) => ({
      day: WEEKDAYS[Number(day)],
      amount,
      pct: (amount / max) * 100,
      isMax: amount === max && amount > 0,
    }));
  }, [outgoing]);

  // ============ SECTION 3: CATEGORY TRENDS (4 WEEKS) ============
  const categoryTrends = useMemo(() => {
    const catMap: Record<string, number[]> = {};
    const now = new Date();

    // Get start of each of the last 4 weeks
    for (const t of outgoing) {
      const d = new Date(t.date);
      const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diffDays > 28) continue;

      const weekIndex = Math.min(Math.floor(diffDays / 7), 3); // 0=this week, 3=4 weeks ago
      const cat = t.category || "others";

      if (!catMap[cat]) catMap[cat] = [0, 0, 0, 0];
      catMap[cat][3 - weekIndex] += t.amount; // reverse so index 0 = oldest
    }

    return Object.entries(catMap).map(([cat, weeks]) => {
      const thisWeek = weeks[3];
      const lastWeek = weeks[2];
      const trend = thisWeek > lastWeek ? "up" : thisWeek < lastWeek ? "down" : "same";
      const maxWeek = Math.max(...weeks, 1);
      return { cat, weeks, trend, maxWeek };
    });
  }, [outgoing]);

  if (history.length === 0) {
    return (
      <View className="flex-1 bg-[#0B0B0D] items-center justify-center px-6">
        <Text className="text-neutral-500 text-base text-center">
          Start adding transactions to see insights!
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold">Insights</Text>
        <Text className="text-neutral-400 text-sm mt-1">Your spending patterns</Text>
      </View>

      {/* STREAK */}
      <Animatable.View animation="fadeInUp" duration={600}>
        <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-6 mb-4 items-center">
          <Flame size={32} color="#F97316" />
          <Text className="text-white text-5xl font-bold mt-3">{streak}</Text>
          <Text className="text-neutral-400 text-sm mt-1">day streak</Text>
          <Text className="text-neutral-500 text-xs mt-2 text-center">
            Consecutive days under your daily average
          </Text>
        </View>
      </Animatable.View>

      {/* TOP SPENDING DAYS */}
      <Animatable.View animation="fadeInUp" delay={150} duration={600}>
        <Text className="text-white text-xl font-semibold mb-3">Top Spending Days</Text>
        <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-5 mb-4">
          {weekdayData.map((item, i) => (
            <View key={item.day} className="flex-row items-center mb-3">
              <Text className={`w-10 text-sm font-medium ${item.isMax ? "text-red-400" : "text-neutral-400"}`}>
                {item.day}
              </Text>
              <View className="flex-1 h-6 bg-neutral-800 rounded-full overflow-hidden mx-3">
                <View
                  style={{
                    width: `${Math.max(item.pct, 2)}%`,
                    backgroundColor: item.isMax ? "#EF4444" : "#52525B",
                  }}
                  className="h-full rounded-full"
                />
              </View>
              <Text className={`text-xs font-semibold w-16 text-right ${item.isMax ? "text-red-400" : "text-neutral-500"}`}>
                ₹{item.amount.toFixed(0)}
              </Text>
            </View>
          ))}
        </View>
      </Animatable.View>

      {/* CATEGORY TRENDS */}
      {categoryTrends.length > 0 && (
        <Animatable.View animation="fadeInUp" delay={300} duration={600}>
          <Text className="text-white text-xl font-semibold mb-3">Category Trends</Text>
          <Text className="text-neutral-500 text-xs mb-3">Last 4 weeks</Text>

          {categoryTrends.map((item) => (
            <View key={item.cat} className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4 mb-3">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-white font-semibold">
                  {item.cat.charAt(0).toUpperCase() + item.cat.slice(1)}
                </Text>
                <View className="flex-row items-center gap-1">
                  {item.trend === "up" ? (
                    <TrendingUp size={14} color="#EF4444" />
                  ) : item.trend === "down" ? (
                    <TrendingDown size={14} color="#22C55E" />
                  ) : null}
                  <Text className={`text-xs font-medium ${
                    item.trend === "up" ? "text-red-400" : item.trend === "down" ? "text-green-400" : "text-neutral-500"
                  }`}>
                    {item.trend === "up" ? "Increasing" : item.trend === "down" ? "Decreasing" : "Stable"}
                  </Text>
                </View>
              </View>

              {/* Mini bar chart - 4 weeks */}
              <View className="flex-row items-end gap-2 h-16">
                {item.weeks.map((w, i) => {
                  const h = item.maxWeek > 0 ? (w / item.maxWeek) * 100 : 0;
                  return (
                    <View key={i} className="flex-1 items-center">
                      <View
                        style={{
                          height: `${Math.max(h, 4)}%`,
                          backgroundColor: CAT_COLORS[item.cat] || colors.chartBlue,
                        }}
                        className="w-full rounded-t-lg"
                      />
                      <Text className="text-neutral-500 text-[10px] mt-1">W{i + 1}</Text>
                    </View>
                  );
                })}
              </View>

              <View className="flex-row justify-between mt-2">
                {item.weeks.map((w, i) => (
                  <Text key={i} className="text-neutral-500 text-[10px] flex-1 text-center">
                    ₹{w.toFixed(0)}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </Animatable.View>
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
