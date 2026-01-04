import Category from "./categoryType";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  category?: Category;
  type: "incoming" | "outgoing";
}

export default Transaction;