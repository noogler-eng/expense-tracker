import Friend from "./friendType";
import User from "./userType";

interface AppData {
  user: User;
  totalIncoming: number;
  totalOutgoing: number;
  friends: Friend[];
}

export default AppData;