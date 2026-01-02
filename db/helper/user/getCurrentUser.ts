import Store from "@/db/Store";
import User from "@/types/helper/userType";

export default async function getCurrentUser(): Promise<User | undefined> {
    console.log("getCurrentUser fn called");

    try{
        const user = await Store.getCurrentUser();
        return user;
    }catch(error){
        console.error("Error in getCurrentUser", error);
    }
}