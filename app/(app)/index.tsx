import Store from "@/db/Store";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    incoming: number;
    outgoing: number;
    friends: any[];
    netBalance: number;
    expectedIncome: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Store.getCurrentUser();
        if (!data.firstName || !data.lastName) {
          router.push("/onboarding");
          return;
        }

        console.log("User data loaded:", data);

        let netBalance = 0;
        let expectedIncome = 0;

        data.friends.forEach((friend: any) => {
          const bal = Number(friend.balance || 0);
          netBalance += bal;
          expectedIncome += bal;
        });

        expectedIncome += data.income;

        setUser({
          ...data,
          netBalance,
          expectedIncome,
        });

        setTimeout(() => setLoading(false), 700);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  /* ---------------- Loading ---------------- */
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0B0B0D]">
        <Animatable.Text
          animation="fadeInDown"
          duration={700}
          className="text-4xl font-bold text-white tracking-wide"
        >
          Resolve
        </Animatable.Text>
        <ActivityIndicator size="large" color="#A3A3A3" className="mt-6" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-12">
      {/* Welcome */}
      <Animatable.View animation="fadeInDown" duration={700}>
        <Text className="text-neutral-400 text-base">
          Welcome back,
        </Text>
        <Text className="text-white text-4xl font-bold mt-1">
          {user?.firstName} {user?.lastName}
        </Text>
      </Animatable.View>

      {/* Main Balance Card */}
      <Animatable.View
        animation="fadeInUp"
        delay={150}
        duration={800}
        className="mt-10"
      >
        <View className="bg-[#0F0F12] border border-neutral-800 rounded-3xl p-6">
          
          {/* Net Balance */}
          <View className="mb-8">
            <Text className="text-neutral-500 text-sm">
              Net Balance
            </Text>
            <Text
              className={`text-4xl font-bold mt-2 ${
                user!.netBalance === 0
                  ? "text-white"
                  : user!.netBalance > 0
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {user!.netBalance === 0
                ? "₹0.00"
                : user!.netBalance > 0
                ? `+₹${user!.netBalance.toFixed(2)}`
                : `-₹${Math.abs(user!.netBalance).toFixed(2)}`}
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
            <Text className="text-green-400 text-2xl font-semibold mt-1">
              ₹{user!.expectedIncome.toFixed(2)}
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
              <Text className="text-green-400 text-xl font-semibold mt-1">
                ₹{user?.incoming ?? 0}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-neutral-500 text-sm">
                Total Outgoing
              </Text>
              <Text className="text-red-400 text-xl font-semibold mt-1">
                ₹{user?.outgoing ?? 0}
              </Text>
            </View>
          </View>
        </View>
      </Animatable.View>

      {/* Footer hint */}
      <Animatable.View
        animation="fadeIn"
        delay={700}
        className="mt-10"
      >
        <Text className="text-neutral-500 text-sm text-center">
          Your balance updates automatically as you add or split expenses
        </Text>
      </Animatable.View>
    </View>
  );
}
