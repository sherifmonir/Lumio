import type { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteconfig, databases } from "./config";



export async function createUserAccount(user: INewUser) {
try{
    const newAccount = await account.create(
        ID.unique(), 
        user.email,
        user.password,
        user.name
        )

    if(!newAccount) throw new Error("ccount creation failedA")

    return newAccount;

}catch(error){
    console.error('Account creation error', error)
    throw error
}
}


export async function saveUserToDB(user:{
    accountId:string,
    email:string,
    name:string,
    imageUrl: string,
    username?:string

}) {
    try{
        console.log('[saveUserToDB] Starting with:', user);
    console.log('[saveUserToDB] Current session:', localStorage.getItem('cookieFallback'));
    /** */
    const currentUser = await account.get();
console.log("AUTH USER:", currentUser);
console.log(appwriteconfig);
console.log(appwriteconfig.userTableId)
console.log({
  databaseId: appwriteconfig.databaseId,
  tableId: appwriteconfig.userTableId,
});
/** */
        const newUser = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.userTableId,
            ID.unique(),
            user

        )
        console.log('[saveUserToDB] Success:', newUser);
        /** */
        return newUser

    }catch(error){
        console.error('[saveUserToDB] Error details:', {
      fullError: error
    });
    throw error;

    }

}


export async function signinAccount(user: {email:string, password:string}){
      try {
    console.log('[signInAccount] Attempting signin for:', user.email);
    
    // CRITICAL: Check if a session already exists
    try {
      const currentSession = await account.getSession('current');
      console.log('[signInAccount] Active session found:', currentSession.$id);
      console.log('[signInAccount] Logging out existing session first...');
      
      // Delete the current session before creating a new one
      await account.deleteSession('current');
      console.log('[signInAccount] Existing session deleted');
    } catch (error) {
      // If error is "Session not found", that's fine - no existing session
      if (error) {
        console.log('[signInAccount] No existing session (expected)');
      }
    }
    /** */
    try{
         console.log('[signInAccount] Attempting signin for:', user.email);
         /** */
        const session = await account.createEmailPasswordSession(user.email, user.password)
        console.log('[signInAccount] Session created successfully:', session.$id);
        return session

    }catch (error) {
    console.error('[signInAccount] Error:', {fullError: error});
    /** */
    throw error;
    }
  } catch (error) {
    console.error('[signInAccount] Outer catch error:', error);
    throw error;
  }
}


export async function getCurrentUser() {
    
    try{
        const currentAccount = await account.get()

        if(!currentAccount) throw Error

        const currentUser = await databases.listDocuments(
            appwriteconfig.databaseId,
            appwriteconfig.userTableId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if(!currentUser) throw Error

        return currentUser.documents[0]

    } catch(error) {
        console.log(error)
    }
}