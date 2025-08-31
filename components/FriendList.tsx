import Store from "@/db/Store";
import { Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
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
      <View className="flex-1 bg-black items-center justify-center px-6">
        <Animatable.Text
          animation="fadeIn"
          duration={500}
          className="text-neutral-400 text-lg text-center"
        >
          You haven’t added any friends yet.
        </Animatable.Text>
        <Text className="text-neutral-500 text-sm mt-2">
          Tap the + button to add your first friend.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={friends}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View className="h-[1px] bg-neutral-800" />}
      renderItem={({ item, index }) => {
        // Darker but colorful palette

        return (
          <Animatable.View
            animation="fadeInUp"
            delay={index * 80}
            duration={500}
          >
            <View className="flex flex-row items-center justify-between px-4 py-2 bg-neutral-900 rounded-xl mb-2">
              
              {/* Left: Avatar + Name */}
              <View className="flex flex-row items-center space-x-3 gap-2">
                <Avtar
                  firstName={item.firstName}
                  lastName={item.lastName}
                  index={index}
                />

                <Text className="text-white flex font-medium">
                  {item.firstName} {item.lastName}
                </Text>
              </View>

              {/* Right: Balance */}
              <View className="flex flex-row items-center space-x-2">
                <Text
                  className={`text-base font-semibold ${
                    item.balance > 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.balance > 0
                    ? `₹${Number(item.balance).toFixed(2).toString()}`
                    : `-₹${Math.abs(Number(item.balance)).toFixed(2).toString()}`}
                </Text>
                <Trash
                  className="text-neutral-500"
                  size={20}
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
