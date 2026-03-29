import { useTheme } from "@/components/ThemeContext";
import React, { useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EMICalc() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const [principal, setPrincipal] = useState("");
 const [rate, setRate] = useState("");
 const [tenure, setTenure] = useState("");
 const [result, setResult] = useState<{
 emi: number;
 totalInterest: number;
 totalPayment: number;
 } | null>(null);

 const calculate = () => {
 const P = Number(principal);
 const annualRate = Number(rate);
 const N = Number(tenure);
 if (!P || !annualRate || !N) return;

 const R = annualRate / 12 / 100;
 const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
 const totalPayment = emi * N;
 const totalInterest = totalPayment - P;

 setResult({ emi, totalInterest, totalPayment });
 };

 return (
 <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">EMI Calculator</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Calculate your monthly installment</Text>
 </View>

 {/* Inputs */}
 <View style={cardStyle} className="rounded-2xl p-5 mb-6">
 <Text style={{ color: t.textSecondary }} className="text-xs mb-1 ml-1">Loan Amount (₹)</Text>
 <TextInput
 value={principal}
 onChangeText={setPrincipal}
 placeholder="e.g., 500000"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-4"
 />

 <Text style={{ color: t.textSecondary }} className="text-xs mb-1 ml-1">Annual Interest Rate (%)</Text>
 <TextInput
 value={rate}
 onChangeText={setRate}
 placeholder="e.g., 8.5"
 keyboardType="decimal-pad"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-4"
 />

 <Text style={{ color: t.textSecondary }} className="text-xs mb-1 ml-1">Tenure (months)</Text>
 <TextInput
 value={tenure}
 onChangeText={setTenure}
 placeholder="e.g., 60"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-4 py-3 rounded-xl mb-4"
 />

 <TouchableOpacity onPress={calculate} activeOpacity={0.85} className="bg-white py-4 rounded-xl items-center">
 <Text className="text-black font-semibold text-lg">Calculate EMI</Text>
 </TouchableOpacity>
 </View>

 {/* Results */}
 {result && (
 <View style={cardStyle} className="rounded-2xl p-5 mb-6">
 <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-4">Result</Text>

 <View className="items-center mb-6">
 <Text style={{ color: t.textSecondary }} className="text-sm">Monthly EMI</Text>
 <Text style={{ color: t.text }} className="text-4xl font-bold mt-1">₹{result.emi.toFixed(0)}</Text>
 </View>

 <View className="border-t pt-4">
 <View className="flex-row justify-between mb-3">
 <Text style={{ color: t.textSecondary }} className="text-sm">Loan Amount</Text>
 <Text style={{ color: t.text }} className="font-semibold">₹{Number(principal).toLocaleString()}</Text>
 </View>
 <View className="flex-row justify-between mb-3">
 <Text style={{ color: t.textSecondary }} className="text-sm">Total Interest</Text>
 <Text className="text-red-400 font-semibold">₹{result.totalInterest.toFixed(0)}</Text>
 </View>
 <View className="flex-row justify-between mb-3">
 <Text style={{ color: t.textSecondary }} className="text-sm">Total Payment</Text>
 <Text style={{ color: t.text }} className="font-semibold">₹{result.totalPayment.toFixed(0)}</Text>
 </View>
 </View>

 {/* Visual breakdown */}
 <View className="mt-4">
 <Text style={{ color: t.textMuted }} className="text-xs mb-2">Principal vs Interest</Text>
 <View className="h-4 bg-neutral-800 rounded-full overflow-hidden flex-row">
 <View
 style={{ width: `${(Number(principal) / result.totalPayment) * 100}%` }}
 className="h-full bg-green-500 rounded-l-full"
 />
 <View className="h-full bg-red-400 flex-1 rounded-r-full" />
 </View>
 <View className="flex-row justify-between mt-2">
 <View className="flex-row items-center gap-1">
 <View className="w-2 h-2 bg-green-500 rounded-full" />
 <Text style={{ color: t.textMuted }} className="text-xs">Principal ({((Number(principal) / result.totalPayment) * 100).toFixed(0)}%)</Text>
 </View>
 <View className="flex-row items-center gap-1">
 <View className="w-2 h-2 bg-red-400 rounded-full" />
 <Text style={{ color: t.textMuted }} className="text-xs">Interest ({((result.totalInterest / result.totalPayment) * 100).toFixed(0)}%)</Text>
 </View>
 </View>
 </View>
 </View>
 )}

 <View className="h-20" />
 </ScrollView>
 );
}
