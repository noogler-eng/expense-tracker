type Category = "food" | "transport" | "entertainment" | "utilities" | "others";

interface Transaction {
  amount: number;
  description: string;
  type: "incoming" | "outgoing";
  category?: Category;
  date: string;
}

export default Transaction;