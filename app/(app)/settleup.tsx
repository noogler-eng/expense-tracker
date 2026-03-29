import * as Haptics from "expo-haptics";
import Store from "@/db/Store";
import Friend from "@/types/helper/friendType";
import colors from "@/utils/helper/colors";
import { useToast } from "@/components/Toast";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import {
 Alert,
 FlatList,
 Text,
 TextInput,
 TouchableOpacity,
 View,
} from "react-native";
import * as Animatable from "react-native-animatable";

export default function SettleUp() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const toast = useToast();
 const [friends, setFriends] = useState<Friend[]>([]);
 const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
 const [amount, setAmount] = useState("");

 useEffect(() => {
 loadFriends();
 }, []);

 const loadFriends = async () => {
 const data = await Store.getFriends();
 // only show friends with non-zero balance
 setFriends((data || []).filter((f) => Number(f.balance) !== 0));
 };

 const handleSettle = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
 if (!selectedFriend) return;

 const settleAmount = Number(amount);
 if (!settleAmount || settleAmount <= 0) return;

 const balance = Number(selectedFriend.balance);
 const maxSettle = Math.abs(balance);

 if (settleAmount > maxSettle) {
 Alert.alert("Too much", `Maximum you can settle is ₹${maxSettle.toFixed(2)}`);
 return;
 }

 try {
 await Store.settleFriend({
 id: selectedFriend.id,
 amount: settleAmount,
 description: `Settlement - ${balance > 0 ? "received from" : "paid to"} ${selectedFriend.firstName}`,
 });

 Alert.alert("Settled!",
 `₹${settleAmount.toFixed(2)} settled with ${selectedFriend.firstName}.`
 );

 setSelectedFriend(null);
 setAmount("");
 loadFriends();
 } catch (error) {
 console.error("Error settling up:", error);
 }
 };

 const handleFullSettle = () => {
 if (!selectedFriend) return;
 setAmount(Math.abs(Number(selectedFriend.balance)).toString());
 };

 // Step 1: Friend selection
 if (!selectedFriend) {
 return (
 <View style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Settle Up</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">
 Clear dues with your friends
 </Text>
 </View>

 {friends.length === 0 ? (
 <View className="flex-1 items-center justify-center">
 <Text style={{ color: t.textMuted }} className="text-base text-center">
 All settled! No pending dues with anyone.
 </Text>
 </View>
 ) : (
 <FlatList
 data={friends}
 keyExtractor={(item) => item.id}
 showsVerticalScrollIndicator={false}
 renderItem={({ item, index }) => {
 const avtarColors = [
 colors.avtar1, colors.avtar2, colors.avtar3, colors.avtar4,
 colors.avtar5, colors.avtar6, colors.avtar7, colors.avtar8,
 ];
 const avatarColor = avtarColors[index % avtarColors.length];
 const balance = Number(item.balance);

 return (
 <Animatable.View
 animation="fadeInUp"
 delay={index * 60}
 duration={450}
 className="mb-3"
 >
 <TouchableOpacity
 activeOpacity={0.85}
 onPress={() => {
 setSelectedFriend(item);
 setAmount(Math.abs(balance).toString());
 }}
 style={cardStyle} className="flex-row items-center justify-between px-4 py-4 rounded-2xl"
 >
 <View className="flex-row items-center gap-3">
 <View
 style={{ backgroundColor: avatarColor }}
 className="w-10 h-10 rounded-full items-center justify-center"
 >
 <Text style={{ color: t.text }} className="font-semibold text-sm">
 {item.firstName[0]}{item.lastName[0]}
 </Text>
 </View>

 <View>
 <Text className="text-white text-base font-medium">
 {item.firstName} {item.lastName}
 </Text>
 <Text style={{ color: t.textMuted }} className="text-xs mt-1">
 {balance > 0 ? "owes you" : "you owe"}
 </Text>
 </View>
 </View>

 <Text
 className={`text-base font-bold ${
 balance > 0 ? colors.positiveAmount : colors.negativeAmount
 }`}
 >
 ₹{Math.abs(balance).toFixed(2)}
 </Text>
 </TouchableOpacity>
 </Animatable.View>
 );
 }}
 />
 )}
 </View>
 );
 }

 // Step 2: Settle amount
 const balance = Number(selectedFriend.balance);
 const owesYou = balance > 0;

 return (
 <View style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-6">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Settle Up</Text>
 <TouchableOpacity onPress={() => { setSelectedFriend(null); setAmount(""); }}>
 <Text className="text-blue-400 text-sm mt-1">← Back</Text>
 </TouchableOpacity>
 </View>

 {/* Friend info card */}
 <View style={cardStyle} className="rounded-2xl p-5 mb-8">
 <Text style={{ color: t.text }} className="text-xl font-bold">
 {selectedFriend.firstName} {selectedFriend.lastName}
 </Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-2">
 {owesYou
 ? `${selectedFriend.firstName} owes you`
 : `You owe ${selectedFriend.firstName}`}
 </Text>
 <Text
 className={`text-3xl font-bold mt-2 ${
 owesYou ? colors.positiveAmount : colors.negativeAmount
 }`}
 >
 ₹{Math.abs(balance).toFixed(2)}
 </Text>
 </View>

 {/* Amount input */}
 <Text style={{ color: t.textMuted }} className="text-xs uppercase tracking-widest mb-2">
 Settlement Amount
 </Text>
 <TextInput
 value={amount}
 onChangeText={setAmount}
 placeholder="Enter amount"
 keyboardType="numeric"
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-5 py-4 rounded-2xl"
 />

 {/* Full settle shortcut */}
 <TouchableOpacity
 onPress={handleFullSettle}
 className="mt-3 mb-8"
 >
 <Text className="text-blue-400 text-sm">
 Settle full amount (₹{Math.abs(balance).toFixed(2)})
 </Text>
 </TouchableOpacity>

 {/* CTA */}
 <TouchableOpacity
 onPress={handleSettle}
 activeOpacity={0.85}
 className={`py-4 rounded-2xl items-center ${
 owesYou ? "bg-green-500" : "bg-red-400"
 }`}
 >
 <Text className="text-black text-lg font-semibold">
 {owesYou
 ? `Record ₹${Number(amount || 0).toFixed(2)} received`
 : `Record ₹${Number(amount || 0).toFixed(2)} paid`}
 </Text>
 </TouchableOpacity>
 </View>
 );
}
