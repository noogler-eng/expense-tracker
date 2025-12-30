import { Text, View } from "react-native";

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
    "bg-[#7C2D12]",
    "bg-[#1E3A8A]",
    "bg-[#14532D]",
    "bg-[#312E81]",
    "bg-[#7F1D1D]",
    "bg-[#581C87]",
    "bg-[#7C2D12]",
    "bg-[#1F2933]",
  ];

  const avatarColor = colors[index % colors.length];

  return (
    <View className="flex-row items-center">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center ${avatarColor}`}
      >
        <Text className="text-white text-[14px] font-semibold leading-[16px]">
          {firstName.charAt(0).toUpperCase()}
          {lastName.charAt(0).toUpperCase()}
        </Text>
      </View>
    </View>
  );
}
