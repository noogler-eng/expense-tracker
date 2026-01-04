import Store from "@/db/Store";
import AppData from "@/types/helper/appType";

export default async function getAppData(){
    console.log("Get App Data fn");
    
    try{
        const data:AppData = await Store.getData();
        return data;
    }catch(error){
        console.error("Error in getting app data", error);
    }
}