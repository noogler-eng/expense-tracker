import Friend from "./friend";
import User from "./user";

interface AppData {
  user: User;
  totalIncoming: number;
  totalOutgoing: number;
  friends: Friend[];
}

export default AppData;