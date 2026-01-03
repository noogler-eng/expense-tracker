import EntryPoint from "@/components/EntryPoint";
import HistoryList from "@/components/HistoryList";
import LoadingScreen from "@/components/Loading";
import Store from "@/db/Store";
import Friend from "@/types/helper/friendType";
import colors from "@/utils/helper/colors";
import { useRouter } from "expo-router";
import { UserPlus } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

export default function History() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const friendsData = await Store.getFriends();
        setFriends(friendsData || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  if (selectedFriend) {
    return (
      <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
        <Text className="text-white text-3xl font-bold mb-2">History</Text>
        <Text className="text-neutral-400 text-sm mb-6">
          {selectedFriend.firstName} {selectedFriend.lastName}
        </Text>

        <TouchableOpacity
          onPress={() => setSelectedFriend(null)}
          className="mb-6"
        >
          <Text className="text-blue-400 text-sm">← Back to friends</Text>
        </TouchableOpacity>

        <HistoryList
          transactions={selectedFriend.history || []}
          firstname={selectedFriend.firstName}
          lastname={selectedFriend.lastName}
          id={selectedFriend.id}
        />
      </View>
    );
  }

  if (!friends || friends.length === 0) {
    return (
      <View
        style={{ backgroundColor: colors.black }}
        className="flex-1 items-center justify-center px-6"
      >
        {/* Illustration / Entry */}
        <View className="mb-5">
          <EntryPoint />
        </View>

        {/* Message */}
        <Text className={`${colors.neutralAmount} text-sm mb-6 text-center`}>
          No friends found. Add friends to start tracking and splitting
          expenses.
        </Text>

        {/* CTA */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.replace("/addfriend")}
          className="flex-row items-center gap-3 bg-white px-6 py-3 rounded-2xl"
        >
          <UserPlus size={18} color="#000" />
          <Text className="text-black font-semibold text-sm">Add Friend</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      <Text className="text-white text-3xl font-bold mb-2">History</Text>
      <Text className={`${colors.neutralAmount} text-sm mb-6`}>
        Select a friend to view transactions
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const avtarColors = [
            colors.avtar1,
            colors.avtar2,
            colors.avtar3,
            colors.avtar4,
            colors.avtar5,
            colors.avtar6,
            colors.avtar7,
            colors.avtar8,
          ];
          const avatarColor = avtarColors[index % avtarColors.length];

          return (
            <TouchableOpacity
              onPress={() => setSelectedFriend(item)}
              activeOpacity={0.85}
              className="flex-row items-center justify-between px-4 py-4 bg-[#0F0F12] border border-neutral-800 rounded-2xl mb-3"
            >
              {/* Left */}
              <View className="flex-row items-center gap-3">
                <View
                  style={{ backgroundColor: avatarColor }}
                  className="w-10 h-10 rounded-full items-center justify-center"
                >
                  <Text
                    className={`${colors.neutralAmount} font-semibold text-sm`}
                  >
                    {item.firstName[0]}
                    {item.lastName[0]}
                  </Text>
                </View>

                <Text
                  className="text-white text-base font-medium max-w-[160px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.firstName} {item.lastName}
                </Text>
              </View>

              {/* Balance */}
              <Text
                className={`text-sm font-semibold ${
                  Number(item.balance) === 0
                    ? colors.neutralAmount
                    : Number(item.balance) > 0
                      ? colors.positiveAmount
                      : colors.negativeAmount
                }`}
              >
                {Number(item.balance) === 0
                  ? "₹0.00"
                  : Number(item.balance) > 0
                    ? `₹${item.balance.toFixed(2)}`
                    : `₹${Math.abs(item.balance).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
