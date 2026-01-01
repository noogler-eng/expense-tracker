import Store from "@/db/Store";
import Transaction from "@/types/transaction";
import sendMsg from "@/utils/msg";
import { useRouter } from "expo-router";
import { Share2, Trash } from "lucide-react-native";
import React from "react";
import { FlatList, Share, Text, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

interface HistoryListProps {
  transactions: Transaction[];
  firstname: string;
  lastname: string;
  id: string;
}

export default function HistoryList({
  transactions,
  firstname,
  lastname,
  id,
}: HistoryListProps) {
  const router = useRouter();

  const sortedHistory = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Share all transactions handler
  const shareAllTransactions = async () => {
    if (sortedHistory.length === 0) {
      alert("No transactions to share.");
      return;
    }

    try {
      const message = sendMsg(firstname, lastname, sortedHistory);
      await Share.share({
        message,
      });
    } catch (error) {
      console.error("Error sharing transactions:", error);
    }
  };

  if (sortedHistory.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-neutral-600 text-lg font-semibold text-center">
          No transactions found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Share All Button */}
      <View className="flex flex-row gap-4 px-6 py-4 border-b border-neutral-800 mb-4 justify-center">
        <TouchableOpacity
          onPress={shareAllTransactions}
          className="bg-neutral-700 py-3 rounded-lg items-center w-2/3"
          activeOpacity={0.8}
        >
          <Share2 size={20} color="#fff" className="mb-1" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Store.clearFriendHistory(id);
            router.push("/history");
          }}
          className="bg-neutral-700 py-3 rounded-lg items-center w-1/3"
          activeOpacity={0.8}
        >
          <Trash size={20} color="#fff" className="mb-1" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedHistory}
        keyExtractor={(item, index) => item.date + index}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
        renderItem={({ item, index }) => {
          let amountColor = "text-neutral-300";
          if (item.type === "incoming") amountColor = "text-neutral-400";
          else if (item.type === "outgoing") amountColor = "text-neutral-500";
          else if (item.type === "split") amountColor = "text-neutral-600";

          return (
            <Animatable.View
              animation="fadeInUp"
              delay={index * 60}
              duration={400}
              className="bg-black rounded-xl border border-neutral-800 px-6 py-5 mb-4 shadow-lg"
            >
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <View className="flex-row items-center space-x-2 justify-between mb-1">
                    <Text
                      className="text-neutral-100 mb-1 truncate"
                      numberOfLines={1}
                    >
                      {item.description || "No description"}
                    </Text>
                    <Text className={`${amountColor} font-semibold mb-2`}>
                      {item.type === "outgoing" ? "-" : ""}₹
                      {Number(item.amount).toFixed(2)}
                    </Text>
                  </View>
                  <Text className="text-neutral-500 text-xs font-medium border-b border-neutral-700 pb-1">
                    {new Date(item.date).toLocaleString()}
                  </Text>
                </View>
              </View>
            </Animatable.View>
          );
        }}
      />
    </View>
  );
}
