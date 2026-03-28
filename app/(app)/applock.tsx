import Store from "@/db/Store";
import { Lock, Shield, Unlock } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function AppLock() {
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
    Alert.alert("Enabled", "App lock is now active.");
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
    Alert.alert("Updated", "PIN changed successfully.");
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
          Alert.alert("Disabled", "App lock removed.");
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
      className="bg-[#0F0F12] border border-neutral-800 text-white text-center text-2xl tracking-[16px] px-6 py-4 rounded-2xl mb-4"
    />
  );

  return (
    <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold">App Lock</Text>
        <Text className="text-neutral-400 text-sm mt-1">Protect your financial data</Text>
      </View>

      {/* Status */}
      <View className="flex-row items-center gap-3 mb-8">
        <View className={`w-12 h-12 rounded-full items-center justify-center ${hasPin ? "bg-green-500/20" : "bg-neutral-800"}`}>
          {hasPin ? <Lock size={20} color="#22C55E" /> : <Unlock size={20} color="#71717A" />}
        </View>
        <View>
          <Text className="text-white font-semibold text-lg">
            {hasPin ? "Lock Enabled" : "No Lock Set"}
          </Text>
          <Text className="text-neutral-500 text-xs">
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
      <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-5 mb-4">
        <View className="flex-row items-center gap-2 mb-4">
          <Shield size={18} color="#A855F7" />
          <Text className="text-white font-semibold">
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
      <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-4 mb-20">
        <Text className="text-neutral-400 text-sm leading-5">
          When enabled, you'll need to enter your PIN each time you open the app. Your PIN is stored locally on this device.
        </Text>
      </View>
    </ScrollView>
  );
}
