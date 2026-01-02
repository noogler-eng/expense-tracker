import Store from "@/db/Store";
import { AppData } from "@/types";

export default async function downloadAllTxnInJSON(){
    console.log("downloadAllTxnInJSON called");
    
    try{
        const data: AppData = await Store.downloadData();
        return data;
    }catch(error){
        console.error("Error in downloading all txn in JSON", error);
    }
}