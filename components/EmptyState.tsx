import { useTheme } from "@/components/ThemeContext";
import {
  BarChart3,
  Clock,
  CreditCard,
  PiggyBank,
  Receipt,
  Search,
  Target,
  UserPlus,
  Users,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const ICONS: Record<string, React.ReactNode> = {
  friends: <UserPlus size={40} color="#52525B" />,
  transactions: <CreditCard size={40} color="#52525B" />,
  history: <Clock size={40} color="#52525B" />,
  groups: <Users size={40} color="#52525B" />,
  search: <Search size={40} color="#52525B" />,
  budget: <Target size={40} color="#52525B" />,
  savings: <PiggyBank size={40} color="#52525B" />,
  insights: <BarChart3 size={40} color="#52525B" />,
  split: <Receipt size={40} color="#52525B" />,
};

interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon = "transactions", title, subtitle, actionLabel, onAction }: Props) {
  const { colors: t } = useTheme();

  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <View
        style={{ backgroundColor: t.card }}
        className="w-20 h-20 rounded-full items-center justify-center mb-5"
      >
        {ICONS[icon] || ICONS.transactions}
      </View>

      <Text style={{ color: t.text }} className="text-lg font-semibold text-center mb-2">
        {title}
      </Text>

      {subtitle && (
        <Text style={{ color: t.textMuted }} className="text-sm text-center leading-5 mb-6">
          {subtitle}
        </Text>
      )}

      {actionLabel && onAction && (
        <TouchableOpacity
          onPress={onAction}
          activeOpacity={0.85}
          className="bg-white px-6 py-3 rounded-2xl"
        >
          <Text className="text-black font-semibold">{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
