import { useRouter } from "expo-router";
import {
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Home,
  Plus,
  Receipt,
  Search,
  User,
  UserPlus,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const FloatingActionMenu = (props: {
  isOpen?: boolean;
  onOpen: () => void;
  onClose: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const progress = useSharedValue(0);
  const router = useRouter();

  const toggleMenu = () => {
    const next = !open;
    setOpen(next);
    progress.value = withSpring(next ? 1 : 0, { damping: 15, stiffness: 120 });
    if (next) props.onOpen();
    else props.onClose();
  };

  const navigate = (link: string) => {
    toggleMenu();
    // @ts-ignore
    router.replace(link);
  };

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: withTiming(progress.value, { duration: 200 }),
    pointerEvents: progress.value > 0.5 ? "auto" : "none",
  }));

  const gridStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(progress.value ? 0 : 80, { damping: 18, stiffness: 100 }) },
      { scale: withSpring(progress.value ? 1 : 0.9, { damping: 18, stiffness: 100 }) },
    ],
    opacity: withTiming(progress.value, { duration: 250 }),
  }));

  const plusStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 45}deg` }],
  }));

  const actions = [
    { icon: <Home size={22} color="#fff" />, label: "Home", link: "/", accent: "#6366F1" },
    { icon: <DollarSign size={22} color="#fff" />, label: "Expense", link: "/addexpense", accent: "#22C55E" },
    { icon: <Receipt size={22} color="#fff" />, label: "Split Bill", link: "/splitbill", accent: "#F59E0B" },
    { icon: <User size={22} color="#fff" />, label: "Transaction", link: "/addtransaction", accent: "#3B82F6" },
    { icon: <UserPlus size={22} color="#fff" />, label: "Add Friend", link: "/addfriend", accent: "#8B5CF6" },
    { icon: <CheckCircle size={22} color="#fff" />, label: "Settle Up", link: "/settleup", accent: "#10B981" },
    { icon: <Users size={22} color="#fff" />, label: "Groups", link: "/groups", accent: "#EC4899" },
    { icon: <Search size={22} color="#fff" />, label: "Search", link: "/search", accent: "#06B6D4" },
    { icon: <BarChart3 size={22} color="#fff" />, label: "Insights", link: "/insights", accent: "#F97316" },
    { icon: <Clock size={22} color="#fff" />, label: "History", link: "/history", accent: "#EF4444" },
  ];

  return (
    <>
      {/* Full-screen overlay with grid */}
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.92)",
            justifyContent: "flex-end",
            paddingBottom: 100,
            paddingHorizontal: 24,
          },
          overlayStyle,
        ]}
      >
        {/* Close button at top right */}
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.7}
          style={{ position: "absolute", top: 60, right: 24, zIndex: 10 }}
        >
          <View className="w-10 h-10 rounded-full bg-neutral-800 items-center justify-center">
            <X size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* Title */}
        <Animated.View style={gridStyle}>
          <Text className="text-white text-2xl font-bold mb-6">Quick Actions</Text>

          {/* Grid - 2 rows of actions */}
          <View className="flex-row flex-wrap gap-3">
            {actions.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => navigate(action.link)}
                activeOpacity={0.8}
                style={{ width: "30.5%" }}
                className="items-center py-4 rounded-2xl bg-[#18181B] border border-neutral-800"
              >
                <View
                  style={{ backgroundColor: action.accent + "20" }}
                  className="w-12 h-12 rounded-full items-center justify-center mb-2"
                >
                  {action.icon}
                </View>
                <Text className="text-white text-xs font-medium" numberOfLines={1}>
                  {action.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>

      {/* FAB Button - always visible */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={toggleMenu}
          activeOpacity={0.9}
          className="w-14 h-14 rounded-full bg-white items-center justify-center"
          style={{
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Animated.View style={plusStyle}>
            <Plus size={26} color="#000" />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default FloatingActionMenu;
