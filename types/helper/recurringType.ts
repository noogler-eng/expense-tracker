import Category from "./categoryType";

interface RecurringExpense {
  id: string;
  amount: number;
  description: string;
  category: Category;
  type: "incoming" | "outgoing";
  frequency: "daily" | "weekly" | "monthly";
  dayOfMonth?: number;
  lastProcessed?: string;
  active: boolean;
}

export default RecurringExpense;
