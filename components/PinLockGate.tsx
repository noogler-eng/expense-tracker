import Store from "@/db/Store";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

interface Props {
  children: React.ReactNode;
}

export default function PinLockGate({ children }: Props) {
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
    <View className="flex-1 bg-[#0B0B0D] items-center justify-center px-8">
      <View className="w-16 h-16 rounded-full bg-neutral-800 items-center justify-center mb-6">
        <Text className="text-2xl">🔒</Text>
      </View>

      <Text className="text-white text-2xl font-bold mb-2">App Locked</Text>
      <Text className="text-neutral-400 text-sm mb-8">Enter your 4-digit PIN</Text>

      <TextInput
        value={pin}
        onChangeText={(t) => {
          setPin(t);
          setError("");
        }}
        secureTextEntry
        maxLength={4}
        keyboardType="number-pad"
        className="bg-[#0F0F12] border border-neutral-800 text-white text-center text-3xl tracking-[20px] px-8 py-5 rounded-2xl w-full mb-4"
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
