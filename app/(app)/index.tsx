import React, { useState, useEffect } from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Store from "@/db/Store";
import * as Animatable from "react-native-animatable";
import FriendList from "@/components/FriendList";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    incoming: number;
    outgoing: number;
    friends: any[];
    netBalance: number;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Store.getCurrentUser();
        if (!data.firstName || !data.lastName) {
          router.push("/onboarding");
          return;
        }
        setUser({
          ...data,
          netBalance: 0,
        });
        setTimeout(() => setLoading(false), 1000);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchData();
  }, []);

  const currTotalIncome = () => {
    if (!user) return 0;
    const total_amount = user.friends.reduce((acc, friend) => {
      return acc + parseInt(friend.balance);
    }, 0);
    return total_amount;
  };

  useEffect(() => {
    if (!user) return;
    const totalIncome = currTotalIncome();
    console.log(user?.friends);
    setUser((prev) => prev && { ...prev, netBalance: totalIncome });
  }, [user?.incoming, user?.outgoing]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Animatable.Text
          animation="fadeInDown"
          duration={900}
          iterationCount={1}
          className="text-5xl font-extrabold text-white tracking-wide"
        >
          SplitMate
        </Animatable.Text>
        <ActivityIndicator
          size="large"
          color="#a3a3a3"
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-6 pt-12">
      {/* Welcome Message */}
      <Animatable.View animation="fadeInDown" duration={800}>
        <Text className="text-gray-400 text-lg">Welcome back,</Text>
        <Text className="text-white text-4xl font-extrabold mt-1">
          {user?.firstName} {user?.lastName} 👋
        </Text>
      </Animatable.View>

      {/* Totals */}
      <Animatable.View
        animation="fadeInUp"
        delay={200}
        duration={800}
        className=""
      >
        <View className="flex-row justify-between my-10">
          <View>
            <Text className="text-gray-500 text-sm">Total Incoming</Text>
            <Text className="text-green-400 text-3xl font-bold mt-1">
              ₹{user?.incoming.toString() ?? "0"}
            </Text>
          </View>
          {user?.netBalance !== null && user?.netBalance !== undefined && (
            <View>
              <Text className="text-gray-500 text-sm">Net Curr Income</Text>
              <Text
                className={` ${user?.netBalance > 0 ? "text-green-400" : "text-red-400"} text-3xl font-bold mt-1`}
              >
                {user?.netBalance >= 0
                  ? `+₹${user?.netBalance.toString()}`
                  : `-₹${Math.abs(user?.netBalance).toString()}`}
              </Text>
            </View>
          )}
          <View className="items-end">
            <Text className="text-gray-500 text-sm">Total Outgoing</Text>
            <Text className="text-red-400 text-3xl font-bold mt-1">
              ₹{user?.outgoing.toString() ?? "0"}
            </Text>
          </View>
        </View>
      </Animatable.View>

      <FriendList />
    </View>
  );
}
