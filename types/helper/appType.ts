import Friend from "./friendType";
import Group from "./groupType";
import RecurringExpense from "./recurringType";
import QuickAddShortcut from "./shortcutType";
import User from "./userType";

interface AppData {
  user: User;
  totalIncoming: number;
  totalOutgoing: number;
  friends: Friend[];
  recurringExpenses?: RecurringExpense[];
  quickAddShortcuts?: QuickAddShortcut[];
  budgets?: Record<string, number>;
  groups?: Group[];
  appLock?: {
    pin?: string;
    useBiometric?: boolean;
  };
}

export default AppData;
