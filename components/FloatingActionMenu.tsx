import colors from "@/utils/helper/colors";
import { useRouter } from "expo-router";
import {
  Clock,
  DollarSign,
  Home,
  Plus,
  Receipt,
  User,
  UserPlus,
} from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const FloatingActionMenu = (props: {
  isOpen?: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const offset = useSharedValue(0);
  const router = useRouter();

  const toggleMenu = () => {
    setOpen(!open);
    offset.value = open ? 0 : 1;
    if (props.isOpen) props.onClose();
    else props.onOpen();
  };

  const animatedStyle = (index: number) =>
    useAnimatedStyle(() => ({
      transform: [
        { translateY: withSpring(-index * 70 * offset.value) },
        { scale: withSpring(offset.value) },
      ],
      opacity: withSpring(offset.value),
    }));

  const labelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: withSpring(offset.value ? 0 : 20) }],
    opacity: withSpring(offset.value),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(offset.value ? 1 : 0.7) }],
  }));

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${offset.value * 45}deg` }],
  }));

  const actions = [
    { icon: <Home size={20} color={colors.white} />, label: "Home", link: "/" },
    {
      icon: <UserPlus size={20} color={colors.white} />,
      label: "Add Friend",
      link: "/addfriend",
    },
    {
      icon: <Receipt size={20} color={colors.white} />,
      label: "Split Bill",
      link: "/splitbill",
    },
    {
      icon: <DollarSign size={20} color={colors.white} />,
      label: "Add Expense",
      link: "/addexpense",
    },
    {
      icon: <User size={20} color={colors.white} />,
      label: "Add Transaction",
      link: "/addtransaction",
    },
    {
      icon: <Clock size={20} color={colors.white} />,
      label: "History",
      link: "/history",
    },
  ];

  return (
    <View className="absolute bottom-6 right-6 w-[260px] items-end">
      {actions.map((action, index) => (
        <Animated.View
          key={action.label}
          style={animatedStyle(index + 1)}
          className="absolute bottom-0 right-0"
        >
          {/* Label + connector */}
          <Animated.View
            style={labelStyle}
            className="absolute right-[56px] flex-row items-center mt-4"
          >
            <View className="px-4 py-[6px] rounded-full bg-neutral-900 shadow-lg">
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                className="text-white text-xs tracking-wide"
              >
                {action.label}
              </Text>
            </View>

            {/* Connector line perfectly centered */}
            <View className="w-6 h-[1px] bg-neutral-700 ml-2 self-center" />
          </Animated.View>

          {/* Icon */}
          <TouchableOpacity
            // @ts-ignore
            onPress={() => router.replace(action.link)}
            activeOpacity={0.85}
          >
            <Animated.View
              style={iconStyle}
              className="w-12 h-12 rounded-full bg-neutral-800 items-center justify-center shadow-lg"
            >
              {action.icon}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      ))}

      {/* Main FAB */}
      <TouchableOpacity
        onPress={toggleMenu}
        activeOpacity={0.9}
        className="w-14 h-14 rounded-full bg-neutral-900 items-center justify-center shadow-xl"
      >
        <Animated.View style={plusStyle}>
          <Plus size={26} color={colors.white} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingActionMenu;
