import Store from "@/db/Store";
import { Category } from "@/types";
import Type from "@/types/helper/typeType";

export default async function splitTransaction(payload: {
    ids: string[];
    totalAmount: number;
    description: string;
    category: Category;
    type: Type;
}) {
    console.log("splitTransaction fn called");

    try{
        await Store.splitAmount(payload);
    }catch(error){
        console.error("Error in splitTransaction", error);
    }
}