import Store from "@/db/Store";

export default async function initilizeAppData(firstname: string, lastname: string) {
    console.log("Initialize App Data fn");

    try{
        
        const user_details = {
            firstName: firstname,
            lastName: lastname
        }
        
        await Store.initialize(user_details);
    }catch(error){
        console.error("Error in initializing app data", error);
    }
}