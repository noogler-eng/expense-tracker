import Store from "@/db/Store";
import AppData from "@/types/helper/appType";
import Friend from "@/types/helper/friendType";
import Transaction from "@/types/helper/transactionType";

export default async function saveAppData(
    user: {
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        gender: string,
        income: number,
        history: Transaction[],
    },
    totalIncoming: number, 
    totalOutgoing: number, 
    friends: Friend[]){
    console.log("Saving app data fn");
    
    try{
        const app_data: AppData = {
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                dateOfBirth: user.dateOfBirth,
                gender: user.gender,
                income: user.income,
                history: user.history,
            },
            totalIncoming: totalIncoming,           
            totalOutgoing: totalOutgoing, 
            friends: friends,        
        }

        await Store.saveData(app_data);
    }catch(error){
        console.error("Error saving app data:", error);
    }
}