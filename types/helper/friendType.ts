import Transaction from "./transactionType";

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  history: Transaction[];
}

export default Friend;