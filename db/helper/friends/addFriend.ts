import Store from "@/db/Store";

export default async function addFriend(firstname: string, lastname: string) {
    console.log("Add friend fn");

    try{
        const friend_details = {
            firstName: firstname,
            lastName: lastname
        }

        await Store.addFriend(friend_details);
    }catch(error){
        console.error("Error in adding friend", error);
    }
}