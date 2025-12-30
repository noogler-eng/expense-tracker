import { useRouter } from "expo-router";
import {
  Clock,
  DollarSign,
  Home,
  Plus,
  Receipt,
  UserPlus,
} from "lucide-react-native";
import React, { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const FloatingActionMenu = () => {
  const [open, setOpen] = useState(false);
  const offset = useSharedValue(0);
  const router = useRouter();

  const toggleMenu = () => {
    setOpen(!open);
    offset.value = open ? 0 : 1;
  };

  const animatedStyle = (index) =>
    useAnimatedStyle(() => ({
      transform: [
        {
          translateY: withSpring(-index * 70 * offset.value), // 70px gap upward
        },
        { scale: withSpring(offset.value) },
      ],
      opacity: withSpring(offset.value),
    }));

  const actions = [
    {
      icon: <Home size={22} color="#fff" />,
      label: "Home",
      link: "/",
    },
    {
      icon: <UserPlus size={22} color="#fff" />,
      label: "Add Friend",
      link: "/addfriend",
    },
    {
      icon: <Receipt size={22} color="#fff" />,
      label: "Split Bill",
      link: "/splitbill",
    },
    {
      icon: <DollarSign size={22} color="#fff" />,
      label: "Add Expense",
      link: "/addexpense",
    },
    {
      icon: <Clock size={22} color="#fff" />,
      label: "History",
      link: "/history",
    },
  ];

  return (
    <View className="absolute bottom-6 right-6 items-end">
      {actions.map((action, index) => (
        <Animated.View
          key={action.label}
          style={animatedStyle(index + 1)}
          className="absolute bottom-0 right-0"
        >
          <TouchableOpacity
            className="flex-row items-center gap-3 px-4 py-3 rounded-full bg-neutral-800 shadow-lg"
            onPress={() => {
              router.push(action.link);
            }}
          >
            {action.icon}
          </TouchableOpacity>
        </Animated.View>
      ))}

      <TouchableOpacity
        onPress={toggleMenu}
        className="w-14 h-14 rounded-full bg-neutral-900 items-center justify-center shadow-lg"
      >
        <Plus
          size={26}
          color="#fff"
          style={{ transform: [{ rotate: open ? "45deg" : "0deg" }] }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionMenu;
