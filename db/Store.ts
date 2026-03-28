import { Category } from "@/types";
import AppData from "@/types/helper/appType";
import Friend from "@/types/helper/friendType";
import Group from "@/types/helper/groupType";
import RecurringExpense from "@/types/helper/recurringType";
import QuickAddShortcut from "@/types/helper/shortcutType";
import Transaction from "@/types/helper/transactionType";
import Type from "@/types/helper/typeType";
import User from "@/types/helper/userType";
import idGen from "@/utils/helper/idGen";
import AsyncStorage from "@react-native-async-storage/async-storage";

enum TYPE {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
}

export default class Store {
  //   /$$$$$$   /$$                                                             /$$
  //  /$$__  $$ | $$                                                            | $$
  // | $$  \__//$$$$$$    /$$$$$$   /$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$        | $$   /$$  /$$$$$$  /$$   /$$
  // |  $$$$$$|_  $$_/   /$$__  $$ /$$__  $$|____  $$ /$$__  $$ /$$__  $$       | $$  /$$/ /$$__  $$| $$  | $$
  //  \____  $$ | $$    | $$  \ $$| $$  \__/ /$$$$$$$| $$  \ $$| $$$$$$$$       | $$$$$$/ | $$$$$$$$| $$  | $$
  //  /$$  \ $$ | $$ /$$| $$  | $$| $$      /$$__  $$| $$  | $$| $$_____/       | $$_  $$ | $$_____/| $$  | $$
  // |  $$$$$$/ |  $$$$/|  $$$$$$/| $$     |  $$$$$$$|  $$$$$$$|  $$$$$$$       | $$ \  $$|  $$$$$$$|  $$$$$$$
  //  \______/   \___/   \______/ |__/      \_______/ \____  $$ \_______//$$$$$$|__/  \__/ \_______/ \____  $$
  //                                                  /$$  \ $$         |______/                     /$$  | $$
  //                                                 |  $$$$$$/                                     |  $$$$$$/
  //                                                  \______/                                       \______/
  private static STORAGE_KEY = process.env.EXPO_PUBLIC_STORAGE_KEY || "";

  //   /$$$$$$
  //  /$$__  $$
  // | $$  \ $$  /$$$$$$   /$$$$$$
  // | $$$$$$$$ /$$__  $$ /$$__  $$
  // | $$__  $$| $$  \ $$| $$  \ $$
  // | $$  | $$| $$  | $$| $$  | $$
  // | $$  | $$| $$$$$$$/| $$$$$$$/
  // |__/  |__/| $$____/ | $$____/
  //           | $$      | $$
  //           | $$      | $$
  //           |__/      |__/
  static async clearCache() {
    try {
      await AsyncStorage.removeItem(Store.STORAGE_KEY);
    } catch (error) {
      throw error;
    }
  }

  public static async getData(): Promise<AppData> {
    try {
      const data = await AsyncStorage.getItem(
        Store.STORAGE_KEY || "expense_tracker_data"
      );
      if (!data)
        return {
          user: {
            firstName: "",
            lastName: "",
            dateOfBirth: "",
            gender: "",
            income: 0,
            history: [],
          },
          totalIncoming: 0,
          totalOutgoing: 0,
          friends: [],
        };

      const appData = JSON.parse(data) as AppData;
      return appData;
    } catch (error) {
      throw error;
    }
  }

  public static async saveData(payload: AppData) {
    try {
      await AsyncStorage.setItem(
        Store.STORAGE_KEY || "expense_tracker_data",
        JSON.stringify(payload)
      );
    } catch (error) {
      throw error;
    }
  }

  public static async initialize(payload: {
    firstName: string;
    lastName: string;
  }) {
    try {
      const appData: AppData = {
        user: {
          firstName: payload.firstName,
          lastName: payload.lastName,
          dateOfBirth: "",
          gender: "",
          income: 0,
          history: [],
        },
        totalIncoming: 0,
        totalOutgoing: 0,
        friends: [],
      };

      await AsyncStorage.setItem(
        Store.STORAGE_KEY || "expense_tracker_data",
        JSON.stringify(appData)
      );
    } catch (error) {
      throw error;
    }
  }

  //  /$$   /$$
  // | $$  | $$
  // | $$  | $$  /$$$$$$$  /$$$$$$   /$$$$$$
  // | $$  | $$ /$$_____/ /$$__  $$ /$$__  $$
  // | $$  | $$|  $$$$$$ | $$$$$$$$| $$  \__/
  // | $$  | $$ \____  $$| $$_____/| $$
  // |  $$$$$$/ /$$$$$$$/|  $$$$$$$| $$
  //  \______/ |_______/  \_______/|__/
  static async setCurrentUser({
    firstName,
    lastName,
    dateOfBirth,
    gender,
    income,
  }: {
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    gender?: string;
    income?: number;
  }) {
    try {
      const appData: AppData = await Store.getData();
      const newAppData: AppData = {
        user: {
          firstName: appData.user.firstName,
          lastName: appData.user.lastName,
          dateOfBirth: appData.user.dateOfBirth,
          gender: appData.user.gender,
          income: appData.user.income,
          history: appData.user.history,
        },
        totalIncoming: appData.totalIncoming,
        totalOutgoing: appData.totalOutgoing,
        friends: appData.friends,
      };

      if (firstName !== "") newAppData.user.firstName = firstName;
      if (lastName !== "") newAppData.user.lastName = lastName;
      if (dateOfBirth !== "") newAppData.user.dateOfBirth = dateOfBirth;
      if (gender) newAppData.user.gender = gender;
      if (income) newAppData.user.income = income;
      await Store.saveData(newAppData);
    } catch (error) {
      throw error;
    }
  }

  static async getCurrentUser(): Promise<User> {
    const appData: AppData = await Store.getData();
    return appData.user;
  }

  static async getUserHistory(): Promise<Transaction[]> {
    const data: AppData = await Store.getData();
    return data.user.history || [];
  }

  static async getUserExtra(): Promise<{
    totalIncoming: number;
    totalOutgoing: number;
  }> {
    const appData: AppData = await Store.getData();
    return {
      totalIncoming: appData.totalIncoming,
      totalOutgoing: appData.totalOutgoing,
    };
  }

  //  /$$$$$$$$        /$$                           /$$
  // | $$_____/       |__/                          | $$
  // | $$     /$$$$$$  /$$  /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$$
  // | $$$$$ /$$__  $$| $$ /$$__  $$| $$__  $$ /$$__  $$ /$$_____/
  // | $$__/| $$  \__/| $$| $$$$$$$$| $$  \ $$| $$  | $$|  $$$$$$
  // | $$   | $$      | $$| $$_____/| $$  | $$| $$  | $$ \____  $$
  // | $$   | $$      | $$|  $$$$$$$| $$  | $$|  $$$$$$$ /$$$$$$$/
  // |__/   |__/      |__/ \_______/|__/  |__/ \_______/|_______/
  static async getFriends(): Promise<Friend[]> {
    const appData: AppData = await Store.getData();
    return appData.friends;
  }

  static async addFriend(payload: { firstName: string; lastName: string }) {
    const appData: AppData = await Store.getData();
    const friend: Friend = {
      id: idGen(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      balance: 0,
      history: [],
    };

    appData.friends.push(friend);
    await Store.saveData(appData);
  }

  static async removeFriend(payload: { id: string }) {
    const appData = await Store.getData();
    appData.friends = appData.friends.filter((f) => f.id !== payload.id);
    await Store.saveData(appData);
  }

  static async updateFriendData(payload: {
    id: string;
    updates: Partial<Friend>;
  }) {
    try {
      const appData = await Store.getData();

      const friendIndex = appData.friends.findIndex(
        (f: any) => f.id === payload.id
      );
      if (friendIndex === -1) {
        return;
      }

      // Merge the updates into the existing friend object
      appData.friends[friendIndex] = {
        ...appData.friends[friendIndex],
        ...payload,
      };

      await Store.saveData(appData);
    } catch (error) {
      throw error;
    }
  }

  //  /$$$$$$$$                                                           /$$     /$$
  // |__  $$__/                                                          | $$    |__/
  //    | $$  /$$$$$$  /$$$$$$  /$$$$$$$   /$$$$$$$  /$$$$$$   /$$$$$$$ /$$$$$$   /$$  /$$$$$$  /$$$$$$$
  //    | $$ /$$__  $$|____  $$| $$__  $$ /$$_____/ |____  $$ /$$_____/|_  $$_/  | $$ /$$__  $$| $$__  $$
  //    | $$| $$  \__/ /$$$$$$$| $$  \ $$|  $$$$$$   /$$$$$$$| $$        | $$    | $$| $$  \ $$| $$  \ $$
  //    | $$| $$      /$$__  $$| $$  | $$ \____  $$ /$$__  $$| $$        | $$ /$$| $$| $$  | $$| $$  | $$
  //    | $$| $$     |  $$$$$$$| $$  | $$ /$$$$$$$/|  $$$$$$$|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
  //    |__/|__/      \_______/|__/  |__/|_______/  \_______/ \_______/   \___/  |__/ \______/ |__/  |__/
  static async addTransactionToUser({
    amount,
    description,
    category,
    type,
  }: {
    amount: number;
    description: string;
    category: Category;
    type: Type;
  }) {
    const appData = await Store.getData();

    if (type === TYPE.INCOMING) {
      appData.totalIncoming += amount;
    } else {
      appData.totalOutgoing += amount;
    }

    const txn: Transaction = {
      id: idGen(),
      amount,
      description,
      type,
      category,
      date: new Date().toISOString(),
    };

    appData?.user?.history?.push(txn);
    await Store.saveData(appData);
  }

  static async addMoneyToFriend({
    id,
    amount,
    description,
    category,
    type,
  }: {
    id: string;
    amount: number;
    description: string;
    category: Category;
    type: Type;
  }) {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === id);
    if (!friend) return;

    if (type === TYPE.INCOMING) {
      appData.totalIncoming += amount;
      friend.balance += amount;
    } else {
      appData.totalOutgoing += amount;
      friend.balance -= amount;
    }

    const txn: Transaction = {
      id: idGen(),
      amount,
      description,
      type,
      category,
      date: new Date().toISOString(),
    };

    friend.history.push(txn);
    await Store.saveData(appData);
  }

  static async getFriendHistory(payload: {
    id: string;
  }): Promise<Transaction[]> {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === payload.id);
    return friend ? friend.history : [];
  }

  static async clearFriendHistory(payload: { id: string }) {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === payload.id);
    if (friend) {
      friend.history = [];
      friend.balance = 0;
      await Store.saveData(appData);
    }
  }

  static async splitAmount({
    ids,
    totalAmount,
    description,
    category,
    type,
  }: {
    ids: string[];
    totalAmount: number;
    description: string;
    category: Category;
    type: Type;
  }) {
    try {
      const appData = await Store.getData();
      if (!ids.length) return;

      const splitValue = totalAmount / ids.length;

      ids.forEach((id: string) => {
        const friend = appData.friends.find((f: any) => f.id === id);
        if (friend) {
          if (type === TYPE.INCOMING) {
            friend.balance += splitValue;
            appData.totalIncoming += splitValue;
          } else if (type === TYPE.OUTGOING) {
            friend.balance -= splitValue;
            appData.totalOutgoing += splitValue;
          }

          const txn: Transaction = {
            id: idGen(),
            amount: splitValue,
            description,
            type,
            category,
            date: new Date().toISOString(),
          };

          friend.history.push(txn);
        }
      });

      await Store.saveData(appData);
    } catch (error) {
      throw error;
    }
  }

  static async updateAnyTransaction({
    id,
    personId,
    updates,
  }: {
    id: string;
    personId?: string;
    updates: Partial<Transaction>;
  }) {
    try {
      const appData = await Store.getData();

      if (!personId) {
        const userTxn = appData.user.history?.find((t: any) => t.id === id);
        if (!userTxn) return;

        Object.assign(userTxn, updates);
        await Store.saveData(appData);
        return;
      }

      const friend = appData.friends.find((f) => f.id === personId);
      if (!friend) return;

      const friendTxn = friend.history.find((t: any) => t.id === id);
      if (!friendTxn) return;

      Object.assign(friendTxn, updates);
      await Store.saveData(appData);
    } catch (error) {
      throw error;
    }
  }

  static async removeTransaction({
    id,
    personId,
  }: {
    id: string;
    personId?: string;
  }) {
    try {
      const appData = await Store.getData();

      if (!personId) {
        const txn = appData.user.history?.find((t: any) => t.id === id);
        if (txn) {
          if (txn.type === TYPE.INCOMING) {
            appData.totalIncoming -= txn.amount;
          } else {
            appData.totalOutgoing -= txn.amount;
          }
        }
        appData.user.history = appData.user.history?.filter(
          (t: any) => t.id !== id
        );
        await Store.saveData(appData);
        return;
      }

      const friend = appData.friends.find((f) => f.id === personId);
      if (!friend) return;

      const txn = friend.history.find((t: any) => t.id === id);
      if (txn) {
        if (txn.type === TYPE.INCOMING) {
          friend.balance -= txn.amount;
          appData.totalIncoming -= txn.amount;
        } else {
          friend.balance += txn.amount;
          appData.totalOutgoing -= txn.amount;
        }
      }

      friend.history = friend.history.filter((t: any) => t.id !== id);
      await Store.saveData(appData);
    } catch (error) {
      throw error;
    }
  }

  //        /$$                                             /$$                 /$$             /$$             /$$
  //       | $$                                            | $$                | $$            | $$            | $$
  //   /$$$$$$$  /$$$$$$  /$$  /$$  /$$ /$$$$$$$   /$$$$$$ | $$  /$$$$$$   /$$$$$$$        /$$$$$$$  /$$$$$$  /$$$$$$    /$$$$$$
  //  /$$__  $$ /$$__  $$| $$ | $$ | $$| $$__  $$ |____  $$| $$ /$$__  $$ /$$__  $$       /$$__  $$ |____  $$|_  $$_/   |____  $$
  // | $$  | $$| $$  \ $$| $$ | $$ | $$| $$  \ $$  /$$$$$$$| $$| $$  \ $$| $$  | $$      | $$  | $$  /$$$$$$$  | $$      /$$$$$$$
  // | $$  | $$| $$  | $$| $$ | $$ | $$| $$  | $$ /$$__  $$| $$| $$  | $$| $$  | $$      | $$  | $$ /$$__  $$  | $$ /$$ /$$__  $$
  // |  $$$$$$$|  $$$$$$/|  $$$$$/$$$$/| $$  | $$|  $$$$$$$| $$|  $$$$$$/|  $$$$$$$      |  $$$$$$$|  $$$$$$$  |  $$$$/|  $$$$$$$
  //  \_______/ \______/  \_____/\___/ |__/  |__/ \_______/|__/ \______/  \_______/       \_______/ \_______/   \___/   \_______/
  static async downloadData(): Promise<AppData> {
    return await Store.getData();
  }

  // ===================== SETTLE UP =====================
  static async settleFriend({
    id,
    amount,
    description,
  }: {
    id: string;
    amount: number;
    description: string;
  }) {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === id);
    if (!friend) return;

    // Positive balance = they owe you → they paid you back → you received (incoming)
    // Negative balance = you owe them → you paid them back → you paid (outgoing)
    const wasPositive = friend.balance > 0;

    if (wasPositive) {
      friend.balance -= amount;
    } else {
      friend.balance += amount;
    }

    const txn: Transaction = {
      id: idGen(),
      amount,
      description,
      type: wasPositive ? "incoming" : "outgoing",
      category: "others",
      date: new Date().toISOString(),
    };

    friend.history.push(txn);
    await Store.saveData(appData);
  }

  // ===================== RECURRING EXPENSES =====================
  static async getRecurringExpenses(): Promise<RecurringExpense[]> {
    const appData = await Store.getData();
    return appData.recurringExpenses || [];
  }

  static async addRecurringExpense(payload: Omit<RecurringExpense, "id" | "lastProcessed" | "active">) {
    const appData = await Store.getData();
    if (!appData.recurringExpenses) appData.recurringExpenses = [];
    appData.recurringExpenses.push({
      ...payload,
      id: idGen(),
      lastProcessed: undefined,
      active: true,
    } as RecurringExpense);
    await Store.saveData(appData);
  }

  static async removeRecurringExpense(id: string) {
    const appData = await Store.getData();
    appData.recurringExpenses = (appData.recurringExpenses || []).filter((r) => r.id !== id);
    await Store.saveData(appData);
  }

  static async processRecurringExpenses() {
    const appData = await Store.getData();
    const recurring = appData.recurringExpenses || [];
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    for (const item of recurring) {
      if (!item.active) continue;

      let shouldProcess = false;
      const lastDate = item.lastProcessed ? new Date(item.lastProcessed) : null;

      if (item.frequency === "daily") {
        shouldProcess = !lastDate || lastDate.toISOString().split("T")[0] !== todayStr;
      } else if (item.frequency === "weekly") {
        shouldProcess = !lastDate || (today.getTime() - lastDate.getTime()) >= 7 * 86400000;
      } else if (item.frequency === "monthly") {
        const targetDay = item.dayOfMonth || 1;
        shouldProcess = today.getDate() === targetDay &&
          (!lastDate || lastDate.getMonth() !== today.getMonth() || lastDate.getFullYear() !== today.getFullYear());
      }

      if (shouldProcess) {
        const txn: Transaction = {
          id: idGen(),
          amount: item.amount,
          description: `[Auto] ${item.description}`,
          type: item.type,
          category: item.category,
          date: today.toISOString(),
        };

        appData.user.history.push(txn);
        if (item.type === TYPE.INCOMING) {
          appData.totalIncoming += item.amount;
        } else {
          appData.totalOutgoing += item.amount;
        }
        item.lastProcessed = todayStr;
      }
    }

    await Store.saveData(appData);
  }

  // ===================== QUICK ADD SHORTCUTS =====================
  static async getShortcuts(): Promise<QuickAddShortcut[]> {
    const appData = await Store.getData();
    return appData.quickAddShortcuts || [];
  }

  static async addShortcut(payload: Omit<QuickAddShortcut, "id">) {
    const appData = await Store.getData();
    if (!appData.quickAddShortcuts) appData.quickAddShortcuts = [];
    appData.quickAddShortcuts.push({ ...payload, id: idGen() });
    await Store.saveData(appData);
  }

  static async removeShortcut(id: string) {
    const appData = await Store.getData();
    appData.quickAddShortcuts = (appData.quickAddShortcuts || []).filter((s) => s.id !== id);
    await Store.saveData(appData);
  }

  static async executeShortcut(id: string) {
    const appData = await Store.getData();
    const shortcut = (appData.quickAddShortcuts || []).find((s) => s.id === id);
    if (!shortcut) return;

    const txn: Transaction = {
      id: idGen(),
      amount: shortcut.amount,
      description: shortcut.label,
      type: shortcut.type,
      category: shortcut.category,
      date: new Date().toISOString(),
    };

    appData.user.history.push(txn);
    if (shortcut.type === TYPE.INCOMING) {
      appData.totalIncoming += shortcut.amount;
    } else {
      appData.totalOutgoing += shortcut.amount;
    }
    await Store.saveData(appData);
  }

  // ===================== BUDGETS =====================
  static async getBudgets(): Promise<Record<string, number>> {
    const appData = await Store.getData();
    return appData.budgets || {};
  }

  static async setBudget(category: string, limit: number) {
    const appData = await Store.getData();
    if (!appData.budgets) appData.budgets = {};
    appData.budgets[category] = limit;
    await Store.saveData(appData);
  }

  static async removeBudget(category: string) {
    const appData = await Store.getData();
    if (appData.budgets) {
      delete appData.budgets[category];
      await Store.saveData(appData);
    }
  }

  // ===================== GROUPS =====================
  static async getGroups(): Promise<Group[]> {
    const appData = await Store.getData();
    return appData.groups || [];
  }

  static async addGroup(payload: { name: string; memberIds: string[] }) {
    const appData = await Store.getData();
    if (!appData.groups) appData.groups = [];
    appData.groups.push({
      id: idGen(),
      name: payload.name,
      memberIds: payload.memberIds,
      history: [],
      createdAt: new Date().toISOString(),
    });
    await Store.saveData(appData);
  }

  static async removeGroup(id: string) {
    const appData = await Store.getData();
    appData.groups = (appData.groups || []).filter((g) => g.id !== id);
    await Store.saveData(appData);
  }

  static async addGroupExpense(payload: {
    groupId: string;
    amount: number;
    description: string;
    category: Category;
    type: Type;
  }) {
    const appData = await Store.getData();
    const group = (appData.groups || []).find((g) => g.id === payload.groupId);
    if (!group) return;

    const splitValue = payload.amount / group.memberIds.length;

    const txn: Transaction = {
      id: idGen(),
      amount: payload.amount,
      description: payload.description,
      type: payload.type,
      category: payload.category,
      date: new Date().toISOString(),
    };
    group.history.push(txn);

    group.memberIds.forEach((memberId) => {
      const friend = appData.friends.find((f) => f.id === memberId);
      if (friend) {
        if (payload.type === TYPE.INCOMING) {
          friend.balance += splitValue;
          appData.totalIncoming += splitValue;
        } else {
          friend.balance -= splitValue;
          appData.totalOutgoing += splitValue;
        }

        friend.history.push({
          id: idGen(),
          amount: splitValue,
          description: `[${group.name}] ${payload.description}`,
          type: payload.type,
          category: payload.category,
          date: new Date().toISOString(),
        });
      }
    });

    await Store.saveData(appData);
  }

  // ===================== APP LOCK =====================
  static async getAppLock(): Promise<{ pin?: string; useBiometric?: boolean }> {
    const appData = await Store.getData();
    return appData.appLock || {};
  }

  static async setAppLock(payload: { pin?: string; useBiometric?: boolean }) {
    const appData = await Store.getData();
    appData.appLock = { ...appData.appLock, ...payload };
    await Store.saveData(appData);
  }

  static async clearAppLock() {
    const appData = await Store.getData();
    appData.appLock = undefined;
    await Store.saveData(appData);
  }
}
