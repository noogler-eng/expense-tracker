import { Category } from "@/types";
import AppData from "@/types/helper/appType";
import Friend from "@/types/helper/friendType";
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
        appData.user.history = appData.user.history?.filter(
          (t: any) => t.id !== id
        );
        await Store.saveData(appData);
        return;
      }

      const friend = appData.friends.find((f) => f.id === personId);
      if (!friend) return;

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
}
