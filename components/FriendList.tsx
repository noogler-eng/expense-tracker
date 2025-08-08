import Store from "@/db/Store";
import { Trash } from "lucide-react-native";
import { useEffect, useState } from "react";
import { FlatList, View, Text } from "react-native";
import * as Animatable from "react-native-animatable";

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
        const colors = [
          "#8B0000", // dark red
          "#004080", // deep blue
          "#006400", // dark green
          "#4B0082", // indigo
          "#800000", // maroon
          "#9932CC", // dark orchid
          "#B22222", // firebrick
          "#2F4F4F", // dark slate gray
        ];
        const avatarColor = colors[index % colors.length];

        return (
          <Animatable.View
            animation="fadeInUp"
            delay={index * 80}
            duration={500}
          >
            <View className="flex flex-row items-center justify-between px-4 py-2 bg-neutral-900 rounded-xl mb-2">
              {/* Left: Avatar + Name */}
              <View className="flex flex-row items-center space-x-3 gap-2">
                <View
                  style={{ backgroundColor: avatarColor }}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <Text className="text-white font-bold text-sm">
                    {item.firstName[0]}
                    {item.lastName[0]}
                  </Text>
                </View>

                <Text className="text-white flex font-medium">
                  {item.firstName} {item.lastName}
                </Text>
              </View>

              {/* Right: Balance */}
              <View className="flex flex-row items-center space-x-2">
                <Text
                  className={`text-base font-semibold ${
                    item.balance > 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {item.balance > 0
                    ? `-₹${Number(item.balance).toFixed(2)}`
                    : `+₹${Math.abs(Number(item.balance)).toFixed(2)}`}
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
