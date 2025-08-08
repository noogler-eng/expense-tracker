import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Store from "@/db/Store";
import HistoryList from "@/components/HistoryList";

interface Transaction {
  amount: number;
  description: string;
  type: "incoming" | "outgoing" | "split";
  date: string;
}

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  history: Transaction[];
}

export default function History() {
  const [user, setUser] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndFriends = async () => {
      setLoading(true);
      try {
        const userData = await Store.getCurrentUser();
        setUser({ firstName: userData.firstName, lastName: userData.lastName });
        setFriends(userData.friends || []);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndFriends();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-black items-center justify-center">
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  // Friends list including self at the top
  const allFriends = [...friends];

  // When a friend is selected, show their transaction history
  if (selectedFriend) {
    const history = selectedFriend.history || [];
    return (
      <View className="flex-1 bg-black px-6 py-8">
        <Text className="text-white text-2xl font-bold mb-6">
          {selectedFriend.firstName} {selectedFriend.lastName}'s History
        </Text>
        <TouchableOpacity
          onPress={() => setSelectedFriend(null)}
          className="mb-4"
        >
          <Text className="text-blue-500">Back to Friends List</Text>
        </TouchableOpacity>
        <HistoryList
          transactions={history}
          firstname={selectedFriend.firstName}
          lastname={selectedFriend.lastName}
          id={selectedFriend.id}
        />
      </View>
    );
  }

  // Default: show list of all friends + self to select from
  return (
    <View className="flex-1 bg-black px-6 py-8">
      <Text className="text-white text-2xl font-bold mb-6">Select Friend</Text>
      <FlatList
        data={allFriends}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const colors = [
            "#8B0000",
            "#004080",
            "#006400",
            "#4B0082",
            "#800000",
            "#9932CC",
            "#B22222",
            "#2F4F4F",
          ];
          const avatarColor = colors[index % colors.length];

          return (
            <TouchableOpacity
              onPress={() => setSelectedFriend(item)}
              className="flex-row items-center justify-between px-4 py-3 bg-neutral-900 rounded-xl mb-3"
            >
              <View className="flex-row items-center space-x-3">
                <View
                  style={{ backgroundColor: avatarColor }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <Text className="text-white font-bold text-lg">
                    {item.firstName[0]}
                    {item.lastName[0]}
                  </Text>
                </View>

                <Text className="text-white text-lg font-medium">
                  {item.firstName} {item.lastName}
                </Text>
              </View>

              <Text
                className={`text-lg font-semibold ${
                  item.balance > 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {item.balance > 0
                  ? `-₹${item.balance.toFixed(2)}`
                  : `+₹${Math.abs(item.balance).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          );
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
