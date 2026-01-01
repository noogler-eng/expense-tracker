import AppData from "@/types/app_data";
import Friend from "@/types/friend";
import Transaction from "@/types/transaction";
import User from "@/types/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class Store {
  private static STORAGE_KEY = "expense_tracker_data";

  // remove all data from local storage
  static async clearCache() {
    try {
      await AsyncStorage.removeItem(Store.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }

  // getting all the data of the application
  private static async getData(): Promise<AppData> {
    try {
      const jsonValue = await AsyncStorage.getItem(Store.STORAGE_KEY);
      return jsonValue
        ? JSON.parse(jsonValue)
        : {
            user: {
              firstName: "",
              lastName: "",
              dateOfBirth: undefined,
              gender: undefined,
              income: undefined,
            },
            totalIncoming: 0,
            totalOutgoing: 0,
            friends: [],
          };
    } catch (error) {
      console.error("Error reading in get app-data:", error);
      throw error;
    }
  }

  // saving all the data of the application
  private static async saveData(data: AppData) {
    try {
      const app_data = data;
      await AsyncStorage.setItem(Store.STORAGE_KEY, JSON.stringify(app_data));
    } catch (error) {
      console.error("Error saving app-data:", error);
      throw error;
    }
  }

  // initialize the store with app data
  static async initialize(firstName: string, lastName: string) {
    try {
      const app_data: AppData = {
        user: {
          firstName,
          lastName,
          dateOfBirth: undefined,
          gender: undefined,
          income: undefined,
        },
        totalIncoming: 0,
        totalOutgoing: 0,
        friends: [],
      }

      await AsyncStorage.setItem(
        Store.STORAGE_KEY,
        JSON.stringify(app_data)
      );

    } catch (error) {
      console.error("Error initializing-store:", error);
      throw error;
    }
  }

  // Set current user name and other details
  static async setCurrentUser({firstName, lastName, dateOfBirth, gender, income}: {firstName: string, lastName: string, dateOfBirth?: string, gender?: string, income?: number}) {
    try {
      const data: AppData = await Store.getData();
      const newAppData = {
        user: {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          dateOfBirth: data.user.dateOfBirth,
          gender: data.user.gender,
          income: data.user.income
        },
        totalIncoming: data.totalIncoming,
        totalOutgoing: data.totalOutgoing,
        friends: data.friends
      }

      if (firstName !== undefined) newAppData.user.firstName = firstName;
      if (lastName !== undefined) newAppData.user.lastName = lastName;
      if (dateOfBirth !== undefined) newAppData.user.dateOfBirth = dateOfBirth;
      if (gender !== undefined) newAppData.user.gender = gender;
      if (income !== undefined) newAppData.user.income = income;
      await Store.saveData(newAppData);
    } catch (error) {
      console.error("Error saving current-user-app-data:", error);
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<User> {
    const data: AppData = await Store.getData();
    console.log("Fetching current user from Store", data);

    return {
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      income: data.user.income ? Number(data.user.income) : 0,
      gender: data.user.gender,
      dateOfBirth: data.user.dateOfBirth,
      history: data.user.history,
    };
  }

  static async getFriends(): Promise<Friend[]> {
    const data: AppData = await Store.getData();
    return data.friends;
  }

  // Add a friend into the local cache
  static async addFriend(firstName: string, lastName: string) {
    const data: AppData = await Store.getData();
    const friend: Friend = {
      id: Date.now().toString(),
      firstName,
      lastName,
      balance: 0,
      history: [],
    }
    data.friends.push(friend);
    await Store.saveData(data);
  }

  // remove a friend from the local cache
  static async removeFriend(friendId: string) {
    const data = await Store.getData();
    data.friends = data.friends.filter((f) => f.id !== friendId);
    await Store.saveData(data);
  }


  // Add money with history
  static async addMoneyToFriend(
    friendId: string,
    amount: number,
    description: string,
    category: "food" | "transport" | "entertainment" | "utilities" | "others",
    type: "incoming" | "outgoing"
  ) {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === friendId);
    if (!friend) return;

    if (type === "incoming") {
      appData.totalIncoming += amount;
      friend.balance += amount;
    } else {
      appData.totalOutgoing += amount;
      friend.balance -= amount;
    }

    const txn: Transaction = {
      amount,
      description,
      type,
      category,
      date: new Date().toISOString(),
    }
    friend.history.push(txn);
    await Store.saveData(appData);
  }

  // Get friend history
  static async getFriendHistory(friendId: string): Promise<Transaction[]> {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === friendId);
    return friend ? friend.history : [];
  }

  // clear friend history
  static async clearFriendHistory(friendId: string) {
    const appData = await Store.getData();
    const friend = appData.friends.find((f) => f.id === friendId);
    if (friend) {
      friend.history = [];
      friend.balance = 0;
      await Store.saveData(appData);
    }
  }

  static async splitAmount({
    friendIds, totalAmount, description, category, type
  }: {
    friendIds: string[],
    totalAmount: number,
    description: string,
    category: "food" | "transport" | "entertainment" | "utilities" | "others",
    type: "incoming" | "outgoing"
  }) {
    try {
      const appData = await Store.getData();
      if (!friendIds.length) return;

      const splitValue = totalAmount / friendIds.length;

      friendIds.forEach((friendId) => {
        const friend = appData.friends.find((f: any) => f.id === friendId);
        if (friend) {
          if (type === "incoming") {
            friend.balance += splitValue;
            appData.totalIncoming += splitValue;
          } else if (type === "outgoing") {
            friend.balance -= splitValue;
            appData.totalOutgoing += splitValue;
          }

          const txn: Transaction = {
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
      console.error("Error splitting amount:", error);
    }
  }

  // updating any friend data
  static async updateFriendData(
    friendId: string,
    updates: {
      firstName?: string;
      lastName?: string;
      balance?: number;
      history?: Transaction[];
    } = {}
  ) {
    try {
      const appData = await Store.getData();

      const friendIndex = appData.friends.findIndex((f: any) => f.id === friendId);
      if (friendIndex === -1) {
        console.error(`Friend with ID ${friendId} not found`);
        return;
      }

      // Merge the updates into the existing friend object
      appData.friends[friendIndex] = {
        ...appData.friends[friendIndex],
        ...updates,
      };

      await Store.saveData(appData);
    } catch (error) {
      console.error("Error updating friend data:", error);
    }
  }
}
