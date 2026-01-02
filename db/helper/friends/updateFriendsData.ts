import Store from "@/db/Store";
import Transaction from "@/types/helper/transactionType";

export default async function updateFriendsData(friendId: string, firstName: string, lastName: string, balance: number, history: Transaction[]) {
    console.log("updateFriendsData fn called");

    try{
        const payload = {
            id: friendId,
            updates: {
                firstName: firstName,
                lastName: lastName,
                balance: balance,
                history: history
            }
        }

        await Store.updateFriendData(payload);
    }catch(error){
        console.error("Error in updating friends data", error);
    }
}