import AppData from "@/types/app_data";
import Friend from "@/types/friend";
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

    return {
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      income: data.user.income ? Number(data.user.income) : 0,
      gender: data.user.gender,
      dateOfBirth: data.user.dateOfBirth,
      history: data.user.history,
    };
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
    type: "incoming" | "outgoing"
  ) {
    const data = await Store.getData();
    const friend = data.friends.find((f) => f.id === friendId);
    if (!friend) return;

    if (type === "incoming") {
      data.totalIncoming += amount;
      friend.balance += amount;
    } else {
      data.totalOutgoing += amount;
      friend.balance -= amount;
    }

    friend.history.push({
      amount,
      description,
      type,
      date: new Date().toISOString(),
    });

    await Store.saveData(data);
  }

  // Get friend history
  static async getFriendHistory(friendId: string): Promise<Transaction[]> {
    const data = await Store.getData();
    const friend = data.friends.find((f) => f.id === friendId);
    return friend ? friend.history : [];
  }

  // clear friend history
  static async clearFriendHistory(friendId: string) {
    const data = await Store.getData();
    const friend = data.friends.find((f) => f.id === friendId);
    if (friend) {
      friend.history = [];
      friend.balance = 0;
      await Store.saveData(data);
    }
  }

  static async splitAmount(
    friendIds: string[],
    totalAmount: number,
    description: string,
    type: "incoming" | "outgoing"
  ) {
    try {
      const data = await Store.getData();
      if (!friendIds.length) return;

      const splitValue = totalAmount / friendIds.length;

      console.log(type)
      friendIds.forEach((friendId) => {
        const friend = data.friends.find((f: any) => f.id === friendId);
        if (friend) {
          if (type === "incoming") {
            friend.balance += splitValue;
            data.totalIncoming += splitValue;
          } else if (type === "outgoing") {
            friend.balance -= splitValue;
            data.totalOutgoing += splitValue;
          }

          friend.history.push({
            type: type,
            amount: splitValue,
            description,
            date: new Date().toISOString(),
          });
        }
      });

      await Store.saveData(data);
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
      const data = await Store.getData();

      const friendIndex = data.friends.findIndex((f: any) => f.id === friendId);
      if (friendIndex === -1) {
        console.error(`Friend with ID ${friendId} not found`);
        return;
      }

      // Merge the updates into the existing friend object
      data.friends[friendIndex] = {
        ...data.friends[friendIndex],
        ...updates,
      };

      await Store.saveData(data);
      console.log(`Friend ${friendId} updated successfully.`);
    } catch (error) {
      console.error("Error updating friend data:", error);
    }
  }
}
