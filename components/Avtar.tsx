import colors from "@/utils/helper/colors";
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
  const avatarColors = [
    colors.avtar1,
    colors.avtar2,
    colors.avtar3,
    colors.avtar4,
    colors.avtar5,
    colors.avtar6,
    colors.avtar7,
    colors.avtar8,
  ];

  const avatarColor = avatarColors[index % avatarColors.length];

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
