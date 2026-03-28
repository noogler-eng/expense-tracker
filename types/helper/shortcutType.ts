import Category from "./categoryType";

interface QuickAddShortcut {
  id: string;
  label: string;
  amount: number;
  category: Category;
  type: "incoming" | "outgoing";
}

export default QuickAddShortcut;
