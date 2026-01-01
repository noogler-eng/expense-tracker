import Loading from "@/components/Loading";
import Store from "@/db/Store";
import Friend from "@/types/friend";
import User from "@/types/user";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [appData, setAppData] = useState<any>(null);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const data: User = await Store.getCurrentUser();
        if (!data || !data.firstName || !data.lastName) {
          router.push("/onboarding");
          return;
        }

        const extra = await Store.getExtra();
        setAppData(extra);

        let netBalance = 0;
        let expectedIncome = 0;

        // history of my friends not mine
        const friendsData: Friend[] = await Store.getFriends();
        friendsData?.forEach((friend: Friend) => {
          const bal = Number(friend.balance || 0);
          netBalance += bal;
          expectedIncome += bal;
        });

        expectedIncome += data.income ?? 0;

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

    // fetchData();
  }, []);

  // if (loading) {
  //   return (
  //     <View className="flex-1 items-center justify-center bg-[#0B0B0D]">
  //       <Animatable.Text
  //         animation="fadeInDown"
  //         duration={700}
  //         className="text-4xl font-bold text-white tracking-wide"
  //       >
  //         Resolve
  //       </Animatable.Text>
  //       <ActivityIndicator size="large" color="#A3A3A3" className="mt-6" />
  //     </View>
  //   );
  // }

  if(loading){
    return <Loading/>
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
                user!.netBalance === 0
                  ? "text-white"
                  : user!.expectedIncome > 0
                  ? "text-green-400"
                  : "text-red-400"
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
              <Text className="text-green-400 text-xl font-semibold mt-1">
                ₹{appData?.totalIncoming ?? 0}
              </Text>
            </View>

            <View className="items-end">
              <Text className="text-neutral-500 text-sm">
                Total Outgoing
              </Text>
              <Text className="text-red-400 text-xl font-semibold mt-1">
                ₹{appData?.totalOutgoing ?? 0}
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
