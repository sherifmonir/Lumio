import type { INewPost, INewUser, Ipost } from "@/types";
import { ID, Permission, Query, Role } from "appwrite";
import { account, appwriteconfig, databases, storage } from "./config";



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
            appwriteconfig.usersTableId,
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
            appwriteconfig.usersTableId,
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
        
         
        
    } catch(error) {
        console.log(error)
        
    }

}

/*=========Create Post=========*/
export async function createPost(post: INewPost){

    try{
        const uploadedFile =  await uploadFile(post.file[0])
        if (!uploadedFile) throw Error

        const fileUrl =  getFilePreview(uploadedFile.$id)
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        const tags = post.tags?.replace(/ /g, "").split(",") || []
        console.log({
    databaseId: appwriteconfig.databaseId,
    postsTableId: appwriteconfig.postsTableId,
    creator: post.userId
});

        const newPost = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags
            }
        )
        if(!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }

        return newPost

    }catch(error){
        console.log(error)
    }

}


export async function uploadFile(file: File){
    try{
        const uoloadedFile = await storage.createFile(
            appwriteconfig.storageId,
            ID.unique(),
            file,
            [
                Permission.read(Role.any()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
            
        )
        return uoloadedFile

    }catch(error){
        console.log(error)
    }

}


export function getFilePreview(fileId: string) {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteconfig.storageId,
            fileId,
            2000,
            2000,
            undefined,
            100
        )
        if (!fileUrl) throw Error

        return fileUrl

    }catch (error){
        console.log(error)
    }
}


export async function deleteFile(fileId: string) {
    try{
        await storage.deleteFile(appwriteconfig.storageId, fileId)

        return { status: "ok"}

    }catch (error){
        console.log(error)
    }
}
/*=========*/

export async function getRecentPost() {
    const posts = await databases.listDocuments<Ipost>(
        appwriteconfig.databaseId,
        appwriteconfig.postsTableId,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
    )
    if(!posts) throw Error

    return posts
}


export async function likePost(postId: string, likesArr: string[]) {
    try {
        const updatedPost = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            postId,
            {
                likes: likesArr
            }
        )
        if(!updatedPost) throw Error

            return updatedPost

     }catch(error) {
        console.log(error)
     }
}


export async function savePost(postId: string, userId: string[]) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.savesTableId,
            ID.unique(),
            {
                user: userId,
                post: postId
            }
        )
        if(!updatedPost) throw Error

            return updatedPost

     }catch(error) {
        console.log(error)
     }
}


export async function deleteSavedPost(savedRecordId: string) {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteconfig.databaseId,
            appwriteconfig.savesTableId,
            savedRecordId
        )
        if(!statusCode) throw Error

            return { status: 'ok'}

     }catch(error) {
        console.log(error)
     }
}