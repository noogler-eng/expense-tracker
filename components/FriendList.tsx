import Store from "@/db/Store";
import { Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";
import Avtar from "./Avtar";

export default function FriendList(props: {
  refreshKey?: number;
  setRefreshKey?: any;
}) {
  const [friends, setFriends] = useState<any[]>([]);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const userData = await Store.getCurrentUser();
        setFriends(userData?.friends || []);
      } catch (error) {
        console.error("Error loading friends:", error);
      }
    };

    fetchFriends();
  }, [props.refreshKey]);

  if (!friends || friends.length === 0) {
    return (
      <View className="flex-1 items-center justify-center px-6">
        <Animatable.Text
          animation="fadeIn"
          duration={500}
          className="text-neutral-400 text-base text-center"
        >
          You haven’t added any friends yet.
        </Animatable.Text>
        <Text className="text-neutral-500 text-sm mt-2 text-center">
          Save friends to easily split expenses with them.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => (
        <View className="h-[1px] bg-neutral-800 my-2" />
      )}
      renderItem={({ item, index }) => {
        return (
          <Animatable.View
            animation="fadeInUp"
            delay={index * 80}
            duration={500}
          >
            <View className="flex-row items-center justify-between px-4 py-3 bg-[#0F0F12] border border-neutral-800 rounded-2xl">
              
              {/* Left: Avatar + Name */}
              <View className="flex-row items-center gap-3">
                <Avtar
                  firstName={item.firstName}
                  lastName={item.lastName}
                  index={index}
                />

                <Text
                className="text-white text-base font-medium max-w-[160px]"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.firstName} {item.lastName}
              </Text>
              </View>

              {/* Right: Balance + Trash */}
              <View className="flex-row items-center gap-3">
                <Text
                  className={`text-sm font-semibold ${
                    Number(item.balance) === 0
                      ? "text-white"
                      : item.balance > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {Number(item.balance) === 0
                    ? "₹0.00"
                    : item.balance > 0
                    ? `₹${Number(item.balance).toFixed(2)}`
                    : `-₹${Math.abs(Number(item.balance)).toFixed(2)}`}
                </Text>

                <Trash
                  size={18}
                  color="#737373"
                  onPress={() => {
                    Store.removeFriend(item.id);
                    props.setRefreshKey
                      ? props.setRefreshKey((prev: any) => prev + 1)
                      : null;
                  }}
                />
              </View>
            </View>
          </Animatable.View>
        );
      }}
    />
  );
}
