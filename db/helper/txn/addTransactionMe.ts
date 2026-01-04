import Store from "@/db/Store";
import { Category } from "@/types";
import Type from "@/types/helper/typeType";

export default async function addTransactionMe(payload: {
    amount: number;
    category: Category;
    description: string;
    type: Type;
}){
    console.log("addTransactionMe fn called");

    try{
        await Store.addTransactionToUser(payload);
    }catch(error){
        console.log("Error in addTransactionMe", error);
    }
}