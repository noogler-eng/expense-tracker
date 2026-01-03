import colors from "@/utils/helper/colors";
import {
    Calculator,
    Database,
    History,
    Home,
    PieChart,
    Receipt,
    Share2,
    Users,
} from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";

const Item = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <View className="flex-row gap-4 mb-6">
      <View className="w-10 h-10 items-center justify-center rounded-xl bg-[#151518]">
        {icon}
      </View>

      <View className="flex-1">
        <Text className="text-white font-semibold text-base mb-1">{title}</Text>
        <Text className="text-neutral-400 text-sm leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
};

export default function About() {
  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.black }}
      contentContainerStyle={{ padding: 24 }}
    >
      {/* Header */}
      <Text className="text-white text-[26px] font-semibold mb-2">
        How Resolve Works
      </Text>

      <Text className="text-neutral-400 text-sm mb-8 leading-5">
        Resolve is a privacy-first personal finance app designed to help you
        track expenses, split bills, and understand your spending — all stored
        locally on your device.
      </Text>

      {/* Steps */}
      <Item
        icon={<Database size={20} color="#A1A1AA" />}
        title="Local Cache First"
        description="All your data is stored securely in local cache on your device.
        This ensures fast performance, offline access, and complete privacy.
        No data is sent to external servers."
      />

      <Item
        icon={<Home size={20} color="#A1A1AA" />}
        title="Core Screens"
        description="The app includes Home, Add Friend, Split Bill, Add Transaction,
        Friend Expenses, History, and Share History screens —
        each designed for quick and intuitive usage."
      />

      <Item
        icon={<Users size={20} color="#A1A1AA" />}
        title="Split Bills with Friends"
        description="Easily split expenses among selected friends.
        Resolve automatically calculates who owes whom and
        keeps balances updated in real time."
      />

      <Item
        icon={<Receipt size={20} color="#A1A1AA" />}
        title="Track Personal & Shared Transactions"
        description="You can add transactions done by you or expenses paid on behalf
        of friends. Each transaction is stored with amount, description,
        category, and timestamp."
      />

      <Item
        icon={<History size={20} color="#A1A1AA" />}
        title="Transaction History"
        description="All transactions are shown in a clean chronological history.
        You can review past expenses anytime and share summaries
        with friends when needed."
      />

      <Item
        icon={<Calculator size={20} color="#A1A1AA" />}
        title="Monthly Balance Calculation"
        description="At the end of each month, Resolve calculates how much money
        remains by comparing your income and total expenses,
        giving you a clear financial snapshot."
      />

      <Item
        icon={<PieChart size={20} color="#A1A1AA" />}
        title="Category-Based Insights"
        description="Resolve analyzes your transactions to show which categories
        you spend the most on — such as food, travel, or entertainment —
        helping you make smarter decisions."
      />

      <Item
        icon={<Share2 size={20} color="#A1A1AA" />}
        title="Share Expense History"
        description="You can share transaction history or settlement summaries
        with friends directly, making bill settlements transparent
        and stress-free."
      />

      {/* Footer */}
      <View className="mt-10">
        <Text className="text-neutral-500 text-xs text-center leading-4">
          Resolve is built with simplicity, privacy, and clarity at its core.
          Your data stays on your device — always under your control.
        </Text>
      </View>
    </ScrollView>
  );
}
