import Store from "@/db/Store";
import Friend from "@/types/friend";

export default async function getFriends() {
    console.log("getFriends fn called");

    try{
        const friends: Friend[] = await Store.getFriends();
        return friends;
    }catch(error){
        console.error("Error in getting friends", error);
    }
}