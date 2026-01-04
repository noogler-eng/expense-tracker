import Store from "@/db/Store";

export default async function clearFriendHistory(friendId: string) {
    console.log("clearFriendHistory called");

    try{
        const payload = {
            id: friendId
        }

        await Store.clearFriendHistory(payload);
    }catch(error){
        console.error("Error in clearing friend history", error);
    }
}