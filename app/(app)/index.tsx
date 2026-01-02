import GlowCard from "@/components/GlowCard";
import Loading from "@/components/Loading";
import getAppData from "@/db/helper/app/getAppData";
import { AppData } from "@/types";
import Friend from "@/types/helper/friendType";
import colors from "@/utils/helper/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);
  const [friendsData, setFriendsData] = useState<Friend[] | null>(null);
  const [showAll, setShowAll] = useState(false);

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
        setFriendsData(appData.friends || []);

        let netBalance = 0;
        let expectedIncome = 0;

        friendsData?.forEach((friend: Friend) => {
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

        setTimeout(() => setLoading(false), 700);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-12">
      {/* Welcome */}
      <Animatable.View animation="fadeInDown" duration={700}>
        <Text className="text-neutral-400 text-base">Welcome back 🎃,</Text>
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
        <GlowCard>
          <View className="bg-[#0F0F12] border border-neutral-800 rounded-3xl p-6">
            {/* Net Balance */}
            <View className="mb-8">
              <Text className="text-neutral-500 text-sm">Net Balance</Text>
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
                <Text className="text-neutral-500 text-sm">Total Incoming</Text>
                <Text
                  className={
                    colors.positiveAmount + " text-xl font-semibold mt-1"
                  }
                >
                  ₹{extra?.totalIncoming ?? 0}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-neutral-500 text-sm">Total Outgoing</Text>
                <Text className="text-red-400 text-xl font-semibold mt-1">
                  ₹{extra?.totalOutgoing ?? 0}
                </Text>
              </View>
            </View>
          </View>
        </GlowCard>
      </Animatable.View>

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
            {(showAll ? history : history.slice(0, 3)).map(
              (txn: any, index: number) => (
                <View
                  key={index}
                  className={`p-4 ${
                    index !==
                    (showAll ? history.length : Math.min(3, history.length)) - 1
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

      {/* Footer hint */}
      <Animatable.View animation="fadeIn" delay={700} className="mt-10">
        <Text className="text-neutral-500 text-sm text-center">
          Your balance updates automatically as you add or split expenses
        </Text>
      </Animatable.View>
    </ScrollView>
  );
}
