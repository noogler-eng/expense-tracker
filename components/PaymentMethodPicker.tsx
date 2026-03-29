import { Banknote, CreditCard, Smartphone } from "lucide-react-native";
import { useTheme } from "@/components/ThemeContext";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type PaymentMethod = "cash" | "upi" | "card";

const METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode; color: string }[] = [
 { value: "cash", label: "Cash", icon: <Banknote size={16} color="#22C55E" />, color: "#22C55E" },
 { value: "upi", label: "UPI", icon: <Smartphone size={16} color="#8B5CF6" />, color: "#8B5CF6" },
 { value: "card", label: "Card", icon: <CreditCard size={16} color="#3B82F6" />, color: "#3B82F6" },
];

interface Props {
 selected: PaymentMethod;
 onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodPicker({ selected, onChange }: Props) {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 return (
 <View>
 <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-2">
 Payment Method
 </Text>
 <View className="flex-row gap-3 mb-6">
 {METHODS.map((m) => {
 const isSelected = selected === m.value;
 return (
 <TouchableOpacity
 key={m.value}
 onPress={() => onChange(m.value)}
 className={`flex-1 flex-row items-center justify-center gap-2 py-3 rounded-2xl border ${
 isSelected
 ? "bg-white/5 border-white/20"
 : " "
 }`}
 >
 {m.icon}
 <Text
 className={`text-sm font-semibold ${
 isSelected ? "text-white" : "text-neutral-400"
 }`}
 >
 {m.label}
 </Text>
 </TouchableOpacity>
 );
 })}
 </View>
 </View>
 );
}
