import Store from "@/db/Store";
import Transaction from "@/types/transaction";

export default async function userHistory() {
    console.log("User history fn");

    try{
        const history: Transaction[] = await Store.getUserHistory();
        return history;
    }catch(error){
        console.error("Error in fetching user history", error);
    }
}