import Store from "@/db/Store";
import { Category } from "@/types";
import Friend from "@/types/helper/friendType";
import Group from "@/types/helper/groupType";
import colors from "@/utils/helper/colors";
import { Trash } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

const CATEGORIES: { label: string; value: Category }[] = [
  { label: "Food", value: "food" },
  { label: "Transport", value: "transport" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Utilities", value: "utilities" },
  { label: "Others", value: "others" },
];

type ViewState = "list" | "create" | "detail";

export default function Groups() {
  const [view, setView] = useState<ViewState>("list");
  const [groups, setGroups] = useState<Group[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  // Create form
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());

  // Expense form
  const [expAmount, setExpAmount] = useState("");
  const [expDesc, setExpDesc] = useState("");
  const [expType, setExpType] = useState<"incoming" | "outgoing">("outgoing");
  const [expCat, setExpCat] = useState<Category>("food");

  const load = async () => {
    setGroups(await Store.getGroups());
    setFriends(await Store.getFriends());
  };

  useEffect(() => { load(); }, []);

  const avatarColors = [colors.avtar1, colors.avtar2, colors.avtar3, colors.avtar4, colors.avtar5, colors.avtar6, colors.avtar7, colors.avtar8];

  const toggleMember = (id: string) => {
    setSelectedMembers((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) { Alert.alert("Missing", "Enter a group name."); return; }
    if (selectedMembers.size === 0) { Alert.alert("Missing", "Select at least one friend."); return; }
    await Store.addGroup({ name: groupName.trim(), memberIds: Array.from(selectedMembers) });
    setGroupName("");
    setSelectedMembers(new Set());
    load();
    setView("list");
    Alert.alert("Created", "Group created successfully.");
  };

  const handleDeleteGroup = (id: string) => {
    Alert.alert("Delete Group", "This will remove the group. Friend balances won't be affected.", [
      { text: "Cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await Store.removeGroup(id); load(); } },
    ]);
  };

  const handleAddExpense = async () => {
    if (!selectedGroup) return;
    if (!expAmount || Number(expAmount) <= 0) { Alert.alert("Missing", "Enter an amount."); return; }
    await Store.addGroupExpense({
      groupId: selectedGroup.id,
      amount: Number(expAmount),
      description: expDesc || "Group expense",
      category: expCat,
      type: expType,
    });
    setExpAmount("");
    setExpDesc("");
    load();
    const updated = (await Store.getGroups()).find((g) => g.id === selectedGroup.id);
    if (updated) setSelectedGroup(updated);
    Alert.alert("Added", "Expense split among group members.");
  };

  const getMemberNames = (memberIds: string[]) =>
    memberIds.map((id) => {
      const f = friends.find((fr) => fr.id === id);
      return f ? `${f.firstName}` : "Unknown";
    }).join(", ");

  // ========== CREATE VIEW ==========
  if (view === "create") {
    return (
      <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-4">
        <View className="mb-6">
          <Text className="text-white text-3xl font-bold">New Group</Text>
          <TouchableOpacity onPress={() => setView("list")}>
            <Text className="text-blue-400 text-sm mt-1">← Back</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-neutral-400 text-xs mb-1 ml-1">Group Name</Text>
        <TextInput
          value={groupName}
          onChangeText={setGroupName}
          placeholder="e.g., Trip to Goa, Flat expenses"
          placeholderTextColor="#6B7280"
          className="bg-[#0F0F12] border border-neutral-800 text-white px-4 py-3 rounded-xl mb-6"
        />

        <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">Select Members</Text>
        {friends.length === 0 ? (
          <Text className="text-neutral-500 text-sm py-4">Add friends first to create a group.</Text>
        ) : (
          friends.map((f, i) => {
            const isSelected = selectedMembers.has(f.id);
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => toggleMember(f.id)}
                activeOpacity={0.85}
                className={`flex-row items-center gap-3 px-4 py-3 rounded-2xl border mb-2 ${
                  isSelected ? "bg-white/5 border-white/20" : "bg-[#0F0F12] border-neutral-800"
                }`}
              >
                <View style={{ backgroundColor: avatarColors[i % avatarColors.length] }} className="w-9 h-9 rounded-full items-center justify-center">
                  <Text className="text-white text-sm font-semibold">{f.firstName[0]}{f.lastName[0]}</Text>
                </View>
                <Text className="text-white font-medium flex-1">{f.firstName} {f.lastName}</Text>
                {isSelected && <View className="w-5 h-5 rounded-full bg-green-500 items-center justify-center"><Text className="text-white text-xs">✓</Text></View>}
              </TouchableOpacity>
            );
          })
        )}

        <TouchableOpacity onPress={handleCreateGroup} activeOpacity={0.85} className="bg-white py-4 rounded-2xl items-center mt-6 mb-20">
          <Text className="text-black text-lg font-semibold">Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ========== DETAIL VIEW ==========
  if (view === "detail" && selectedGroup) {
    const totalExpenses = selectedGroup.history.reduce((sum, t) => sum + t.amount, 0);

    return (
      <ScrollView className="flex-1 bg-[#0B0B0D] px-6 pt-4">
        <View className="mb-4">
          <TouchableOpacity onPress={() => { setView("list"); setSelectedGroup(null); }}>
            <Text className="text-blue-400 text-sm">← Back to groups</Text>
          </TouchableOpacity>
          <Text className="text-white text-3xl font-bold mt-2">{selectedGroup.name}</Text>
          <Text className="text-neutral-400 text-sm mt-1">
            {selectedGroup.memberIds.length} members · ₹{totalExpenses.toFixed(0)} total
          </Text>
        </View>

        {/* Members */}
        <View className="flex-row flex-wrap gap-2 mb-6">
          {selectedGroup.memberIds.map((id, i) => {
            const f = friends.find((fr) => fr.id === id);
            if (!f) return null;
            return (
              <View key={id} className="items-center mr-2">
                <View style={{ backgroundColor: avatarColors[i % avatarColors.length] }} className="w-10 h-10 rounded-full items-center justify-center">
                  <Text className="text-white text-xs font-semibold">{f.firstName[0]}{f.lastName[0]}</Text>
                </View>
                <Text className="text-neutral-400 text-xs mt-1">{f.firstName}</Text>
              </View>
            );
          })}
        </View>

        {/* Add Expense */}
        <View className="bg-[#0F0F12] border border-neutral-800 rounded-2xl p-5 mb-6">
          <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">Add Group Expense</Text>

          <TextInput
            value={expAmount}
            onChangeText={setExpAmount}
            placeholder="Amount"
            keyboardType="numeric"
            placeholderTextColor="#6B7280"
            className="bg-[#18181B] border border-neutral-800 text-white px-4 py-3 rounded-xl mb-3"
          />
          <TextInput
            value={expDesc}
            onChangeText={setExpDesc}
            placeholder="Description"
            placeholderTextColor="#6B7280"
            className="bg-[#18181B] border border-neutral-800 text-white px-4 py-3 rounded-xl mb-3"
          />

          <View className="flex-row mb-3">
            <TouchableOpacity
              onPress={() => setExpType("outgoing")}
              className={`flex-1 py-3 mr-2 rounded-xl items-center ${expType === "outgoing" ? "bg-red-500/20" : "bg-[#18181B]"}`}
            >
              <Text className={`font-semibold text-sm ${expType === "outgoing" ? "text-red-400" : "text-neutral-400"}`}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setExpType("incoming")}
              className={`flex-1 py-3 ml-2 rounded-xl items-center ${expType === "incoming" ? "bg-green-500/20" : "bg-[#18181B]"}`}
            >
              <Text className={`font-semibold text-sm ${expType === "incoming" ? "text-green-400" : "text-neutral-400"}`}>Collect</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap gap-2 mb-3">
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                onPress={() => setExpCat(cat.value)}
                className={`px-3 py-2 rounded-xl border ${expCat === cat.value ? "bg-white border-white" : "bg-[#18181B] border-neutral-800"}`}
              >
                <Text className={`text-xs font-semibold ${expCat === cat.value ? "text-black" : "text-neutral-400"}`}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={handleAddExpense} activeOpacity={0.85} className="bg-white py-3 rounded-xl items-center">
            <Text className="text-black font-semibold">Split Among Group</Text>
          </TouchableOpacity>
        </View>

        {/* History */}
        <Text className="text-neutral-500 text-xs uppercase tracking-widest mb-3">Group History</Text>
        {selectedGroup.history.length === 0 ? (
          <Text className="text-neutral-500 text-sm text-center py-8">No expenses yet.</Text>
        ) : (
          [...selectedGroup.history].reverse().map((t, i) => (
            <View key={t.id} className="bg-[#0F0F12] border border-neutral-800 rounded-2xl px-4 py-3 mb-2">
              <View className="flex-row justify-between">
                <View className="flex-1 mr-3">
                  <Text className="text-white font-medium" numberOfLines={1}>{t.description}</Text>
                  <Text className="text-neutral-500 text-xs mt-1">{new Date(t.date).toLocaleDateString()}</Text>
                </View>
                <Text className={`font-bold ${t.type === "incoming" ? "text-green-400" : "text-red-400"}`}>
                  ₹{t.amount.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        )}

        <View className="h-20" />
      </ScrollView>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <View className="flex-1 bg-[#0B0B0D] px-6 pt-4">
      <View className="mb-6">
        <Text className="text-white text-3xl font-bold">Groups</Text>
        <Text className="text-neutral-400 text-sm mt-1">Manage group expenses</Text>
      </View>

      <TouchableOpacity
        onPress={() => setView("create")}
        activeOpacity={0.85}
        className="bg-white py-4 rounded-2xl items-center mb-6"
      >
        <Text className="text-black text-lg font-semibold">Create Group</Text>
      </TouchableOpacity>

      {groups.length === 0 ? (
        <View className="items-center py-12">
          <Text className="text-neutral-500 text-base text-center">
            No groups yet. Create one to start splitting expenses!
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item, index }) => {
            const total = item.history.reduce((s, t) => s + t.amount, 0);
            return (
              <Animatable.View animation="fadeInUp" delay={index * 60} duration={400} className="mb-3">
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => { setSelectedGroup(item); setView("detail"); }}
                  className="bg-[#0F0F12] border border-neutral-800 rounded-2xl px-4 py-4"
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="text-white text-base font-semibold">{item.name}</Text>
                      <Text className="text-neutral-500 text-xs mt-1">
                        {item.memberIds.length} members · {getMemberNames(item.memberIds)}
                      </Text>
                      <Text className="text-neutral-400 text-xs mt-1">
                        ₹{total.toFixed(0)} total · {item.history.length} expenses
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDeleteGroup(item.id)} className="p-2">
                      <Trash size={16} color={colors.trash} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animatable.View>
            );
          }}
        />
      )}
    </View>
  );
}
