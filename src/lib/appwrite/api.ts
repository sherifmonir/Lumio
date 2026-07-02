import type { INewUser } from "@/types";
import { ID, Query } from "appwrite";
import { account, appwriteconfig, databases } from "./config";



export async function createUserAccount(user: INewUser) {
try{

    try {
      await account.deleteSession('current');
    } catch {
     // No session exists
    }
    const newAccount = await account.create(
        ID.unique(), 
        user.email,
        user.password,
        user.name
        )

    if(!newAccount) throw new Error("ccount creation failed")

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
        const newUser = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.userTableId,
            ID.unique(),
            user
        )
        return newUser
}


export async function signinAccount(user: {email:string, password:string}){

    try {
      await account.deleteSession('current');
    } catch {
      // No session exists
    }

  try{
        const session = await account.createEmailPasswordSession(user.email, user.password)

        return session

      }catch (error) {
         console.log(error)
         return null
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
        return null
    }
}


export async function signoutAccount() {
    try {    

        return await account.deleteSession("current")
        
    } catch (error){
        console.log(error)
        return null
    }

}