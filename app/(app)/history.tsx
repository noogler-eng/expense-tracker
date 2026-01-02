import HistoryList from "@/components/HistoryList";
import Store from "@/db/Store";
import Friend from "@/types/helper/friendType";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function History() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

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
    return (
      <View className="flex-1 bg-[#0B0B0D] items-center justify-center">
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (selectedFriend) {
    return (
      <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
        <Text className="text-white text-3xl font-bold mb-2">
          History
        </Text>
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

  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      <Text className="text-white text-3xl font-bold mb-2">
        History
      </Text>
      <Text className="text-neutral-400 text-sm mb-6">
        Select a friend to view transactions
      </Text>

      <FlatList
        data={friends}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const colors = [
            "#7C2D12",
            "#1E3A8A",
            "#14532D",
            "#312E81",
            "#7F1D1D",
            "#581C87",
            "#7C2D12",
            "#1F2933",
          ];
          const avatarColor = colors[index % colors.length];
          const balance = Number(item.balance);

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
                  <Text className="text-white font-semibold text-sm">
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
                    ? "text-white"
                    : Number(item.balance) > 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {Number(item.balance) === 0
                  ? "₹0.00"
                  : Number(item.balance) > 0
                  ? `₹${item.balance.toFixed(2)}`
                  : `-₹${Math.abs(item.balance).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
