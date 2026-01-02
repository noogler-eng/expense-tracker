import Store from "@/db/Store";
import Transaction from "@/types/helper/transactionType";

export default async function editTransaction(payload: any) {
    console.log("edit transaction fn called");

    try{
        const updatedTxn: Transaction = {

        }

        await Store.editTransaction(updatedTxn);
    }catch(error){
        console.error("Error in editing transaction", error);
    }
}