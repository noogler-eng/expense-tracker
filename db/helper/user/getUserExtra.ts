import Store from "@/db/Store";

export default async function getUserExtra() {
    console.log("get user extra fn called!");

    try{
        const userExtra = await Store.getUserExtra();
        return userExtra;
    }catch(error){
        console.error("Error in getUserExtra", error);
    }
}