import Store from "@/db/Store";
import Category from "@/types/helper/categoryType";
import Type from "@/types/helper/typeType";

export default async function simpleTransaction(payload: {
    id: string;
    amount: number;
    category: Category;
    description: string;
    type: Type;
}) {
    console.log("simpleTransaction fn called with payload:", payload);

    try{
        const simpleTransaction = {
            id: payload.id,
            amount: payload.amount,
            category: payload.category,
            description: payload.description,
            type: payload.type
        }

        await Store.addMoneyToFriend(simpleTransaction);
    }catch(error){
        console.error("Error in simpleTransaction", error);
    }
}