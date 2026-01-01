import Store from "@/db/Store";

export default async function clearCache() {
    console.log("Cache cleared fn");

    try{
        await Store.clearCache();
    }catch(err){
        console.error("Error in clearing cache", err);
    }
}