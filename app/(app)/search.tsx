import Store from "@/db/Store";
import colors from "@/utils/helper/colors";
import { useTheme } from "@/components/ThemeContext";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from "react-native-animatable";

type SearchResult = {
 id: string;
 description: string;
 amount: number;
 date: string;
 type: "incoming" | "outgoing";
 category?: string;
 source: string;
};

const TYPE_FILTERS = ["All", "Incoming", "Outgoing"] as const;
const CATEGORY_FILTERS = ["All", "Food", "Transport", "Entertainment", "Utilities", "Others"] as const;
const DATE_FILTERS = ["All Time", "This Month", "This Week"] as const;

export default function SearchScreen() {
 const { colors: t, isDark, cardStyle, inputStyle } = useTheme();
 const [query, setQuery] = useState("");
 const [allTxns, setAllTxns] = useState<SearchResult[]>([]);
 const [typeFilter, setTypeFilter] = useState<string>("All");
 const [catFilter, setCatFilter] = useState<string>("All");
 const [dateFilter, setDateFilter] = useState<string>("All Time");

 useEffect(() => {
 const load = async () => {
 const data = await Store.getData();
 const results: SearchResult[] = [];

 (data.user.history || []).forEach((t) => {
 results.push({ ...t, source: "You" });
 });

 (data.friends || []).forEach((f) => {
 (f.history || []).forEach((t) => {
 results.push({ ...t, source: `${f.firstName} ${f.lastName}` });
 });
 });

 results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
 setAllTxns(results);
 };
 load();
 }, []);

 const filtered = allTxns.filter((t) => {
 if (query && !t.description.toLowerCase().includes(query.toLowerCase())) return false;
 if (typeFilter === "Incoming" && t.type !== "incoming") return false;
 if (typeFilter === "Outgoing" && t.type !== "outgoing") return false;
 if (catFilter !== "All" && (t.category || "others").toLowerCase() !== catFilter.toLowerCase()) return false;

 if (dateFilter !== "All Time") {
 const d = new Date(t.date);
 const now = new Date();
 if (dateFilter === "This Month") {
 if (d.getMonth() !== now.getMonth() || d.getFullYear() !== now.getFullYear()) return false;
 } else if (dateFilter === "This Week") {
 const weekAgo = new Date();
 weekAgo.setDate(weekAgo.getDate() - 7);
 if (d < weekAgo) return false;
 }
 }
 return true;
 });

 const FilterRow = ({ options, selected, onSelect }: { options: readonly string[]; selected: string; onSelect: (v: string) => void }) => (
 <View className="flex-row flex-wrap gap-2 mb-3">
 {options.map((opt) => (
 <TouchableOpacity
 key={opt}
 onPress={() => onSelect(opt)}
 className={`px-3 py-2 rounded-xl border ${
 selected === opt ? "bg-white border-white" : " "
 }`}
 >
 <Text className={`text-xs font-semibold ${selected === opt ? "text-black" : "text-neutral-400"}`}>{opt}</Text>
 </TouchableOpacity>
 ))}
 </View>
 );

 return (
 <View style={{ backgroundColor: t.bg }} className="flex-1 px-6 pt-4">
 <View className="mb-4">
 <Text style={{ color: t.text }} className="text-3xl font-bold">Search</Text>
 <Text style={{ color: t.textSecondary }} className="text-sm mt-1">Find any transaction</Text>
 </View>

 <TextInput
 value={query}
 onChangeText={setQuery}
 placeholder="Search by description..."
 placeholderTextColor="#6B7280"
 style={inputStyle} className="px-5 py-4 rounded-2xl mb-4"
 />

 <FilterRow options={TYPE_FILTERS} selected={typeFilter} onSelect={setTypeFilter} />
 <FilterRow options={CATEGORY_FILTERS} selected={catFilter} onSelect={setCatFilter} />
 <FilterRow options={DATE_FILTERS} selected={dateFilter} onSelect={setDateFilter} />

 <Text style={{ color: t.textMuted }} className="text-xs mb-2">{filtered.length} results</Text>

 <FlatList
 data={filtered}
 keyExtractor={(item, i) => item.id + i}
 showsVerticalScrollIndicator={false}
 contentContainerStyle={{ paddingBottom: 80 }}
 renderItem={({ item, index }) => (
 <Animatable.View animation="fadeInUp" delay={Math.min(index * 30, 300)} duration={300} className="mb-3">
 <View style={cardStyle} className="rounded-2xl px-4 py-4">
 <View className="flex-row justify-between items-start">
 <View className="flex-1 mr-3">
 <Text style={{ color: t.text }} className="font-medium" numberOfLines={1}>{item.description}</Text>
 <Text style={{ color: t.textMuted }} className="text-xs mt-1">
 {item.source} · {new Date(item.date).toLocaleDateString()} · {item.category || "—"}
 </Text>
 </View>
 <Text className={`font-bold ${item.type === "incoming" ? colors.positiveAmount : colors.negativeAmount}`}>
 {item.type === "outgoing" ? "-" : "+"}₹{item.amount.toFixed(2)}
 </Text>
 </View>
 </View>
 </Animatable.View>
 )}
 ListEmptyComponent={
 <View className="items-center py-12">
 <Text style={{ color: t.textMuted }} className="text-base">No transactions found.</Text>
 </View>
 }
 />
 </View>
 );
}
