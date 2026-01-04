import Store from "@/db/Store";
import { Category } from "@/types";
import Type from "@/types/helper/typeType";

export default async function updateTransaction(payload: any) {
    console.log("update / remove transaction fn called");

    try{
        
        if(!payload.updates){
            await Store.removeTransaction({
                id: payload.id,
                personId: payload?.personId || null
            });
        }

        const txnHistory: {
            id: string;
            personId?: string;
            updates: {
                amount: number;
                category: Category;
                description: string;
                type: Type;
            };
        } = {
            id: payload.id,
            personId: payload?.personId || null,
            updates: {
                amount: payload.amount,
                category: payload.category,
                description: payload.description,
                type: payload.type
            }
        }

        await Store.updateAnyTransaction(txnHistory);
    }catch(error){
        console.error("Error in editing transaction", error);
    }
}