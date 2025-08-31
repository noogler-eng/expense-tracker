import { Text } from "react-native";
import { View } from "react-native";

export default function Avtar({
  firstName,
  lastName,
  index,
}: {
  firstName: string;
  lastName: string;
  index: any;
}) {
  const colors = [
    "bg-[#8B0000]", // dark red
    "bg-[#004080]", // deep blue
    "bg-[#006400]", // dark green
    "bg-[#4B0082]", // indigo
    "bg-[#800000]", // maroon
    "bg-[#9932CC]", // dark orchid
    "bg-[#B22222]", // firebrick
    "bg-[#2F4F4F]", // dark slate gray
  ];
  const avatarColor = colors[index % colors.length];

  return (
    <View className="flex flex-row items-center">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${avatarColor}`}
      >
        <Text className="text-white text-sm font-semibold">
          {firstName.charAt(0).toUpperCase()}
          {lastName.charAt(0).toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
