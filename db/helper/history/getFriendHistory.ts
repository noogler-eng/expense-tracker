import Store from "@/db/Store";

export default async function getFriendHistory(friendId: string) {
    console.log("getFriendHistory called");

    try{
        const payload = {
            id: friendId
        }
        
        const history = await Store.getFriendHistory(payload);
        return history;
    }catch(error){      
        console.error("Error in getting friend history", error);
    }
}