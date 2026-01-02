import Store from "@/db/Store";
import User from "@/types/helper/userType";

export default async function setCurrentUser(payload: User) {
    console.log("setCurrentUser fn called with payload:", payload);
    
    try{
        const user: User = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            dateOfBirth: payload.dateOfBirth,
            gender: payload.gender,
            income: payload.income,
            history: payload.history || []
        }

        await Store.setCurrentUser(user);
    }catch(error){
        console.error("Error in setCurrentUser", error);
    }
}