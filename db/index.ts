// app data 
import clearCache from "@/db/helper/app/clearCache";
import getAppData from "@/db/helper/app/getAppData";
import initilizeAppData from "@/db/helper/app/initilizeAppData";
import saveAppData from "@/db/helper/app/saveAppData";

// user data
import getCurrentUser from "@/db/helper/user/getCurrentUser";
import getUserExtra from "@/db/helper/user/getUserExtra";
import setCurrentUser from "@/db/helper/user/setCurrentUser";


// friends data
import addFriend from "@/db/helper/friends/addFriend";
import getFriends from "@/db/helper/friends/getFriends";
import removeFriend from "@/db/helper/friends/removeFriend";
import updateFriendsData from "@/db/helper/friends/updateFriendsData";


// transaction data
import addTransactionMe from "@/db/helper/txn/addTransactionMe";
import simpleTransaction from "@/db/helper/txn/simpleTransaction";
import splitTransaction from "@/db/helper/txn/splitTransaction";
import updateTransaction from "@/db/helper/txn/updateTransaction";


// history data
import clearFriendHistory from "@/db/helper/history/clearFriendHistory";
import getFriendHistory from "@/db/helper/history/getFriendHistory";
import userHistory from "@/db/helper/history/userHistory";

// export all 
import downloadAllTxnInJSON from "@/db/helper/export/downloadAllTxnInJSON";

const app = {
    initilizeAppData: initilizeAppData,
    getAppData: getAppData,
    saveAppData: saveAppData,
    clearCache: clearCache,
}

const user = {
    getCurrentUser: getCurrentUser,
    setCurrentUser: setCurrentUser,
    getUserExtra: getUserExtra,
}

const friends = {
    getFriends: getFriends,
    addFriend: addFriend,
    removeFriend: removeFriend,
    updateFriendsData: updateFriendsData,
}

const transactions = {
    simpleTransaction: simpleTransaction,
    splitTransaction: splitTransaction,
    updateTransaction: updateTransaction,
    addTransactionMe: addTransactionMe,
}

const history = {
    userHistory: userHistory,
    getFriendHistory: getFriendHistory,
    clearFriendHistory: clearFriendHistory,
}

const exportAll = {
    downloadAllTxnInJSON: downloadAllTxnInJSON,
};

export default {
    app,
    user,
    friends,
    transactions,
    history,
    exportAll
}