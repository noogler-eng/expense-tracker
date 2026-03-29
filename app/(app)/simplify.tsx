import Store from "@/db/Store";
import { useTheme } from "@/components/ThemeContext";
import Friend from "@/types/helper/friendType";
import React, { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import * as Animatable from "react-native-animatable";

interface DebtEdge {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

export default function Simplify() {
  const { colors: t, isDark, cardStyle } = useTheme();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    const load = async () => {
      const data = await Store.getFriends();
      setFriends((data || []).filter((f) => Number(f.balance) !== 0));
    };
    load();
  }, []);

  // Build simplified debts
  // Positive balance = friend owes you
  // Negative balance = you owe friend
  const { original, simplified } = useMemo(() => {
    const YOU = "you";
    const orig: DebtEdge[] = [];
    const balances: Record<string, number> = { [YOU]: 0 };
    const names: Record<string, string> = { [YOU]: "You" };

    friends.forEach((f) => {
      const bal = Number(f.balance);
      const name = `${f.firstName} ${f.lastName}`;
      names[f.id] = name;

      if (bal > 0) {
        // Friend owes you
        orig.push({ from: f.id, fromName: name, to: YOU, toName: "You", amount: bal });
        balances[f.id] = (balances[f.id] || 0) - bal;
        balances[YOU] = (balances[YOU] || 0) + bal;
      } else if (bal < 0) {
        // You owe friend
        orig.push({ from: YOU, fromName: "You", to: f.id, toName: name, amount: Math.abs(bal) });
        balances[YOU] = (balances[YOU] || 0) - Math.abs(bal);
        balances[f.id] = (balances[f.id] || 0) + Math.abs(bal);
      }
    });

    // Simplify: greedily match largest creditor with largest debtor
    const simple: DebtEdge[] = [];
    const creditors: { id: string; amount: number }[] = [];
    const debtors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, bal]) => {
      if (bal > 0.01) creditors.push({ id, amount: bal });
      else if (bal < -0.01) debtors.push({ id, amount: Math.abs(bal) });
    });

    creditors.sort((a, b) => b.amount - a.amount);
    debtors.sort((a, b) => b.amount - a.amount);

    let i = 0, j = 0;
    while (i < creditors.length && j < debtors.length) {
      const settle = Math.min(creditors[i].amount, debtors[j].amount);
      if (settle > 0.01) {
        simple.push({
          from: debtors[j].id,
          fromName: names[debtors[j].id] || debtors[j].id,
          to: creditors[i].id,
          toName: names[creditors[i].id] || creditors[i].id,
          amount: settle,
        });
      }
      creditors[i].amount -= settle;
      debtors[j].amount -= settle;
      if (creditors[i].amount < 0.01) i++;
      if (debtors[j].amount < 0.01) j++;
    }

    return { original: orig, simplified: simple };
  }, [friends]);

  const saved = original.length - simplified.length;

  return (
    <ScrollView style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
      <View className="mb-6">
        <Text style={{ color: t.text }} className="text-3xl font-bold">Simplify Debts</Text>
        <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Minimize the number of payments</Text>
      </View>

      {friends.length === 0 ? (
        <View className="items-center py-16">
          <Text className="text-5xl mb-4">🎉</Text>
          <Text style={{ color: t.text }} className="text-lg font-semibold">All clear!</Text>
          <Text style={{ color: t.textMuted }} className="text-sm mt-2 text-center">No pending debts with anyone.</Text>
        </View>
      ) : (
        <>
          {/* Before */}
          <Animatable.View animation="fadeInUp" duration={500}>
            <Text style={{ color: t.text }} className="text-lg font-semibold mb-3">Current Debts ({original.length})</Text>
            <View style={cardStyle} className="rounded-2xl p-4 mb-6">
              {original.map((d, i) => (
                <View key={i} className={`flex-row items-center justify-between py-3 ${i < original.length - 1 ? "border-b" : ""}`} style={{ borderColor: t.border }}>
                  <View className="flex-row items-center flex-1">
                    <Text className="text-red-400 text-sm font-medium">{d.fromName}</Text>
                    <Text style={{ color: t.textMuted }} className="text-xs mx-2">→</Text>
                    <Text className="text-green-400 text-sm font-medium">{d.toName}</Text>
                  </View>
                  <Text style={{ color: t.text }} className="font-bold">₹{d.amount.toFixed(0)}</Text>
                </View>
              ))}
            </View>
          </Animatable.View>

          {/* Arrow */}
          <Animatable.View animation="fadeIn" delay={300} className="items-center mb-4">
            <View style={cardStyle} className="rounded-full px-4 py-2">
              <Text style={{ color: t.text }} className="text-sm font-semibold">
                ↓ Simplified{saved > 0 ? ` (${saved} fewer payment${saved > 1 ? "s" : ""})` : ""}
              </Text>
            </View>
          </Animatable.View>

          {/* After */}
          <Animatable.View animation="fadeInUp" delay={400} duration={500}>
            <Text style={{ color: t.text }} className="text-lg font-semibold mb-3">Optimized ({simplified.length})</Text>
            <View style={cardStyle} className="rounded-2xl p-4 mb-6">
              {simplified.length === 0 ? (
                <Text style={{ color: t.textMuted }} className="text-sm text-center py-4">Already optimal!</Text>
              ) : (
                simplified.map((d, i) => (
                  <View key={i} className={`py-3 ${i < simplified.length - 1 ? "border-b" : ""}`} style={{ borderColor: t.border }}>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center flex-1">
                        <Text className="text-red-400 font-semibold">{d.fromName}</Text>
                        <Text style={{ color: t.textMuted }} className="mx-2">pays</Text>
                        <Text className="text-green-400 font-semibold">{d.toName}</Text>
                      </View>
                      <Text className="text-white text-lg font-bold">₹{d.amount.toFixed(0)}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </Animatable.View>

          {/* Info */}
          <View style={cardStyle} className="rounded-2xl p-4 mb-6">
            <Text style={{ color: t.textSecondary }} className="text-sm leading-5">
              This shows the minimum number of payments needed to settle all debts. Instead of everyone paying everyone, follow the optimized plan above.
            </Text>
          </View>
        </>
      )}

      <View className="h-20" />
    </ScrollView>
  );
}
