import Store from "@/db/Store";

export default async function removeFriend(friendId: string) {
    console.log("removeFriend fn called");

    try{
        const payload = {
            id: friendId
        }

        await Store.removeFriend(payload);
    }catch(error){
        console.error("Error in removing friend", error);
    }
}