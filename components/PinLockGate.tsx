import Store from "@/db/Store";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
 children: React.ReactNode;
}

export default function PinLockGate({ children }: Props) {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const [locked, setLocked] = useState<boolean | null>(null);
 const [pin, setPin] = useState("");
 const [error, setError] = useState("");

 useEffect(() => {
 const check = async () => {
 const lock = await Store.getAppLock();
 setLocked(!!lock.pin);
 };
 check();
 }, []);

 // Still loading
 if (locked === null) return null;

 // No lock set
 if (!locked) return <>{children}</>;

 const handleUnlock = async () => {
 const lock = await Store.getAppLock();
 if (pin === lock.pin) {
 setLocked(false);
 setPin("");
 setError("");
 } else {
 setError("Wrong PIN. Try again.");
 setPin("");
 }
 };

 return (
 <View style={{ backgroundColor: t.bg }} className="flex-1 items-center justify-center px-8">
 <View className="w-16 h-16 rounded-full bg-neutral-800 items-center justify-center mb-6">
 <Text className="text-2xl">🔒</Text>
 </View>

 <Text style={{ color: t.text }} className="text-2xl font-bold mb-2">App Locked</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mb-8">Enter your 4-digit PIN</Text>

 <TextInput
 value={pin}
 onChangeText={(t) => {
 setPin(t);
 setError("");
 }}
 secureTextEntry
 maxLength={4}
 keyboardType="number-pad"
 style={inputStyle} className="text-center text-3xl tracking-[20px] px-8 py-5 rounded-2xl w-full mb-4"
 placeholder="••••"
 placeholderTextColor="#3F3F46"
 />

 {error ? (
 <Text className="text-red-400 text-sm mb-4">{error}</Text>
 ) : null}

 <TouchableOpacity
 onPress={handleUnlock}
 activeOpacity={0.85}
 className="bg-white py-4 rounded-2xl items-center w-full mt-2"
 >
 <Text className="text-black text-lg font-semibold">Unlock</Text>
 </TouchableOpacity>
 </View>
 );
}
