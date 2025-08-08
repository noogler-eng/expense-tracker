import { useEffect, useState } from "react";
import { Text, View, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import Store from "@/db/Store";
import * as Animatable from "react-native-animatable";
import FriendList from "@/components/FriendList";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
    incoming: number;
    outgoing: number;
    friends: any[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await Store.getCurrentUser();
        if (!data.firstName || !data.lastName) {
          router.push("/onboarding");
          return;
        }
        setUser(data);
        setTimeout(() => setLoading(false), 1000);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };
    fetchData();
  }, []);

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
      {/* App Header */}
      <Animatable.Text
        animation="fadeInDown"
        duration={700}
        className="text-white text-3xl font-bold mb-6"
      >
        SplitMate
      </Animatable.Text>

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
          <View className="">
            <Text className="text-gray-500 text-sm">Total Incoming</Text>
            <Text className="text-green-400 text-3xl font-bold mt-1">
              ₹{user?.incoming ?? 0}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-gray-500 text-sm">Total Outgoing</Text>
            <Text className="text-red-400 text-3xl font-bold mt-1">
              ₹{user?.outgoing ?? 0}
            </Text>
          </View>
        </View>
      </Animatable.View>

      <FriendList/>
    </View>
  );
}
