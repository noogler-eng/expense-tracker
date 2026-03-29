import Store from "@/db/Store";
import { Lock, Shield, Unlock } from "lucide-react-native";
import { useToast } from "@/components/Toast";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AppLock() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const toast = useToast();
 const [hasPin, setHasPin] = useState(false);
 const [currentPin, setCurrentPin] = useState("");
 const [newPin, setNewPin] = useState("");
 const [confirmPin, setConfirmPin] = useState("");

 useEffect(() => {
 const load = async () => {
 const lock = await Store.getAppLock();
 setHasPin(!!lock.pin);
 };
 load();
 }, []);

 const handleSetPin = async () => {
 if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
 Alert.alert("Invalid", "PIN must be exactly 4 digits.");
 return;
 }
 if (newPin !== confirmPin) {
 Alert.alert("Mismatch", "PINs don't match. Try again.");
 return;
 }
 await Store.setAppLock({ pin: newPin });
 setHasPin(true);
 setNewPin("");
 setConfirmPin("");
 toast.show("App lock is now active.");
 };

 const handleChangePin = async () => {
 const lock = await Store.getAppLock();
 if (currentPin !== lock.pin) {
 Alert.alert("Wrong", "Current PIN is incorrect.");
 return;
 }
 if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
 Alert.alert("Invalid", "New PIN must be exactly 4 digits.");
 return;
 }
 if (newPin !== confirmPin) {
 Alert.alert("Mismatch", "New PINs don't match.");
 return;
 }
 await Store.setAppLock({ pin: newPin });
 setCurrentPin("");
 setNewPin("");
 setConfirmPin("");
 toast.show("PIN changed successfully.");
 };

 const handleRemovePin = () => {
 Alert.alert("Remove Lock", "This will disable app lock. Continue?", [
 { text: "Cancel" },
 {
 text: "Remove",
 style: "destructive",
 onPress: async () => {
 await Store.clearAppLock();
 setHasPin(false);
 setCurrentPin("");
 setNewPin("");
 setConfirmPin("");
 toast.show("App lock removed.");
 },
 },
 ]);
 };

 const PinInput = ({ value, onChange, placeholder }: { value: string; onChange: (t: string) => void; placeholder: string }) => (
 <TextInput
 value={value}
 onChangeText={onChange}
 secureTextEntry
 maxLength={4}
 keyboardType="number-pad"
 placeholder={placeholder}
 placeholderTextColor="#6B7280"
 style={inputStyle} className="text-center text-2xl tracking-[16px] px-6 py-4 rounded-2xl mb-4"
 />
 );

 return (
 <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">App Lock</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Protect your financial data</Text>
 </View>

 {/* Status */}
 <View className="flex-row items-center gap-3 mb-8">
 <View className={`w-12 h-12 rounded-full items-center justify-center ${hasPin ? "bg-green-500/20" : "bg-neutral-800"}`}>
 {hasPin ? <Lock size={20} color="#22C55E" /> : <Unlock size={20} color="#71717A" />}
 </View>
 <View>
 <Text style={{ color: t.text }} className="font-semibold text-lg">
 {hasPin ? "Lock Enabled" : "No Lock Set"}
 </Text>
 <Text style={{ color: t.textMuted }} className="text-xs">
 {hasPin ? "4-digit PIN is active" : "Your app is not protected"}
 </Text>
 </View>
 <View className={`ml-auto px-3 py-1 rounded-full ${hasPin ? "bg-green-500/20" : "bg-red-500/20"}`}>
 <Text className={`text-xs font-bold ${hasPin ? "text-green-400" : "text-red-400"}`}>
 {hasPin ? "ON" : "OFF"}
 </Text>
 </View>
 </View>

 {/* Set / Change PIN */}
 <View style={cardStyle} className="rounded-2xl p-5 mb-4">
 <View className="flex-row items-center gap-2 mb-4">
 <Shield size={18} color="#A855F7" />
 <Text style={{ color: t.text }} className="font-semibold">
 {hasPin ? "Change PIN" : "Set a 4-digit PIN"}
 </Text>
 </View>

 {hasPin && (
 <PinInput value={currentPin} onChange={setCurrentPin} placeholder="Current PIN" />
 )}
 <PinInput value={newPin} onChange={setNewPin} placeholder="New PIN" />
 <PinInput value={confirmPin} onChange={setConfirmPin} placeholder="Confirm PIN" />

 <TouchableOpacity
 onPress={hasPin ? handleChangePin : handleSetPin}
 activeOpacity={0.85}
 className="bg-white py-4 rounded-2xl items-center"
 >
 <Text className="text-black text-lg font-semibold">
 {hasPin ? "Change PIN" : "Enable Lock"}
 </Text>
 </TouchableOpacity>
 </View>

 {/* Remove PIN */}
 {hasPin && (
 <TouchableOpacity
 onPress={handleRemovePin}
 activeOpacity={0.85}
 className="bg-red-500/10 border border-red-500/30 py-4 rounded-2xl items-center mb-8"
 >
 <Text className="text-red-400 text-lg font-semibold">Remove Lock</Text>
 </TouchableOpacity>
 )}

 {/* Info */}
 <View style={cardStyle} className="rounded-2xl p-4 mb-20">
 <Text style={{ color: t.textSecondary }} className="text-sm leading-5">
 When enabled, you'll need to enter your PIN each time you open the app. Your PIN is stored locally on this device.
 </Text>
 </View>
 </ScrollView>
 );
}
