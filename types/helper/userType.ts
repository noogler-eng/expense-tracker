import Transaction from "./transactionType";

interface User {
  firstName: string;
  lastName: string;
  dateOfBirth?: string
  gender: string
  income: number;
  history: Transaction[];
}

export default User;