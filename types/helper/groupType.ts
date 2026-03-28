import Transaction from "./transactionType";

interface Group {
  id: string;
  name: string;
  memberIds: string[];
  history: Transaction[];
  createdAt: string;
}

export default Group;
