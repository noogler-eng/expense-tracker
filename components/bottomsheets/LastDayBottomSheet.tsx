import { Transaction } from "@/types";
import colors from "@/utils/helper/colors";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  onClose?: () => void;
  transactions?: Transaction[];
}

/* ================= DATE HELPERS ================= */

const parseDate = (date: string) => new Date(date);

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

/* ================= COMPONENT ================= */

export default function LastDayBottomSheet({
  onClose,
  transactions = [],
}: Props) {
  const sheetRef = useRef<BottomSheet>(null);

  const handleClose = () => {
    sheetRef.current?.close();
    onClose?.();
  };

  /* ================= ANALYTICS ================= */

  const analytics = useMemo(() => {
    if (!transactions.length) {
      return {
        yesterdayTotal: 0,
        topCategory: null as null | { name: string; amount: number },
        predictedToday: 0,
        avgDaily: 0,
      };
    }

    // Yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayTxns = transactions.filter(
      (t) => t.type === "outgoing" && isSameDay(parseDate(t.date), yesterday)
    );

    const yesterdayTotal = yesterdayTxns.reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals: Record<string, number> = {};
    yesterdayTxns.forEach((t) => {
      const cat = t.category || "others";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
    });

    const topCategoryEntry = Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    )[0];

    const topCategory = topCategoryEntry
      ? { name: topCategoryEntry[0], amount: topCategoryEntry[1] }
      : null;

    // Prediction
    const DAYS = 7;
    const dailyTotals: number[] = [];

    for (let i = 1; i <= DAYS; i++) {
      const day = new Date();
      day.setDate(day.getDate() - i);

      const total = transactions
        .filter(
          (t) => t.type === "outgoing" && isSameDay(parseDate(t.date), day)
        )
        .reduce((sum, t) => sum + t.amount, 0);

      if (total > 0) dailyTotals.push(total);
    }

    const avgDaily =
      dailyTotals.length > 0
        ? dailyTotals.reduce((a, b) => a + b, 0) / dailyTotals.length
        : 0;

    return {
      yesterdayTotal,
      topCategory,
      predictedToday: Math.round(avgDaily),
      avgDaily,
    };
  }, [transactions]);

  const progress =
    analytics.avgDaily > 0
      ? Math.min(analytics.predictedToday / analytics.avgDaily, 1)
      : 0;

  /* ================= UI ================= */

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={["60%"]}
      enablePanDownToClose
      onClose={handleClose}
      backgroundStyle={{
        backgroundColor: colors.inputBoxBackground,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
      }}
      handleIndicatorStyle={{
        backgroundColor: "#3F3F46",
        width: 48,
      }}
    >
      <BottomSheetView style={{ padding: 20 }}>
        {/* HEADER */}
        <Text
          style={{
            color: "#FFFFFF",
            fontSize: 18,
            fontWeight: "600",
            marginBottom: 16,
          }}
        >
          Spending Insights
        </Text>

        {/* YESTERDAY CARD */}
        <View
          style={{
            backgroundColor: "#18181B",
            borderRadius: 20,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <Text style={{ color: "#A1A1AA", fontSize: 12 }}>Yesterday</Text>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 30,
              fontWeight: "700",
              marginTop: 4,
            }}
          >
            ₹{analytics.yesterdayTotal}
          </Text>

          {analytics.topCategory && (
            <View
              style={{
                marginTop: 10,
                alignSelf: "flex-start",
                backgroundColor: "#27272A",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 999,
              }}
            >
              <Text style={{ color: "#E5E7EB", fontSize: 12 }}>
                Mostly on{" "}
                <Text style={{ fontWeight: "600" }}>
                  {analytics.topCategory.name}
                </Text>{" "}
                • ₹{analytics.topCategory.amount}
              </Text>
            </View>
          )}
        </View>

        {/* TODAY PREDICTION CARD */}
        <View
          style={{
            backgroundColor: "#18181B",
            borderRadius: 20,
            padding: 16,
          }}
        >
          <Text style={{ color: "#A1A1AA", fontSize: 12 }}>
            Today’s predicted spend
          </Text>

          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 28,
              fontWeight: "700",
              marginTop: 4,
            }}
          >
            ₹{analytics.predictedToday}
          </Text>

          {/* PROGRESS BAR */}
          <View
            style={{
              height: 6,
              backgroundColor: "#27272A",
              borderRadius: 999,
              marginTop: 12,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress * 100}%`,
                backgroundColor: progress > 1 ? "#EF4444" : "#22C55E",
              }}
            />
          </View>

          <Text
            style={{
              color: "#71717A",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            Based on last 7 days average
          </Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleClose}
            className="bg-white py-4 rounded-2xl mt-6 mb-10"
          >
            <Text className="text-black text-center font-semibold text-base">
              close!
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
