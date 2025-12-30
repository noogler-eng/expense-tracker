import AsyncStorage from "@react-native-async-storage/async-storage";

interface Transaction {
  amount: number;
  description: string;
  type: "incoming" | "outgoing" | "split";
  date: string;
}

interface Friend {
  id: string;
  firstName: string;
  lastName: string;
  balance: number;
  history: Transaction[];
}

interface AppData {
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  income?: string;
  totalIncoming: number;
  totalOutgoing: number;
  friends: Friend[];
}

export default class Store {
  private static STORAGE_KEY = "expense_tracker_data";

  static async clearCache() {
    try {
      await AsyncStorage.removeItem(Store.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing cache:", error);
      throw error;
    }
  }

  private static async getData(): Promise<AppData> {
    try {
      const jsonValue = await AsyncStorage.getItem(Store.STORAGE_KEY);
      return jsonValue
        ? JSON.parse(jsonValue)
        : {
            firstName: "",
            lastName: "",
            dateOfBirth: undefined,
            gender: undefined,
            income: undefined,
            totalIncoming: 0,
            totalOutgoing: 0,
            friends: [],
          };
    } catch (error) {
      console.error("Error reading data:", error);
      throw error;
    }
  }

  private static async saveData(data: AppData) {
    try {
      await AsyncStorage.setItem(Store.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving data:", error);
      throw error;
    }
  }

  static async initialize(firstName: string, lastName: string) {
    try {
      await AsyncStorage.setItem(
        Store.STORAGE_KEY,
        JSON.stringify({
          firstName,
          lastName,
          totalIncoming: 0,
          totalOutgoing: 0,
          friends: [],
        })
      );
      console.log("Store initialized with user data.");
    } catch (error) {
      console.error("Error initializing store:", error);
    }
  }

  // Set current user name
  static async setCurrentUser({firstName, lastName, dateOfBirth, gender, income}: {firstName: string, lastName: string, dateOfBirth?: string, gender?: string, income?: string}) {
    try {
      const data = await Store.getData();
      data.firstName = firstName;
      data.lastName = lastName;
      if (dateOfBirth !== undefined) data.dateOfBirth = dateOfBirth;
      if (gender !== undefined) data.gender = gender;
      if (income !== undefined) data.income = income;
      await Store.saveData(data);
    } catch (error) {
      console.error("Error saving current user:", error);
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<{
    firstName: string;
    lastName: string;
    incoming: any;
    outgoing: any;
    friends: any;
  }> {
    const data = await Store.getData();
    return {
      firstName: data.firstName,
      lastName: data.lastName,
      incoming: data.totalIncoming,
      outgoing: data.totalOutgoing,
      friends: data.friends,
    };
  }

  // Add a friend
  static async addFriend(firstName: string, lastName: string) {
    const data = await Store.getData();
    data.friends.push({
      id: Date.now().toString(),
      firstName,
      lastName,
      balance: 0,
      history: [],
    });
    await Store.saveData(data);
  }

  // remove a friend
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
            type: "split",
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
