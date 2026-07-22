import type { INewPost, INewUser, IPost, IUpdatePost } from "@/types";
import {  ID, Permission, Query, Role } from "appwrite";
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
            [
                Query.equal('accountId', currentAccount.$id),
                Query.select(['*', 'save.*', 'save.post.$id'])
            ]
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
    const posts = await databases.listDocuments<IPost>(
        appwriteconfig.databaseId,
        appwriteconfig.postsTableId,
        [
            Query.orderDesc("$createdAt"),
            Query.limit(20),
            Query.select(['*', 'creator.*', 'likes.*'])
        ]
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


export async function savePost(postId: string, userId: string) {
    try {
        const updatedPost = await databases.createDocument(
            appwriteconfig.databaseId,
            appwriteconfig.savesTableId,
            ID.unique(),
            {
                user: userId,
                post: postId
            },
            [
                Permission.read(Role.any()),
                Permission.update(Role.any()),
                Permission.delete(Role.any()),
            ]
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


export async function getPostById(postId: string) {

    try{
        const post = databases.getDocument<IPost>(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            postId
        )
        return post

    }catch(error){
        console.log(error)
    }

}


export async function updatePost(post: IUpdatePost) {
    const hasFileToUpdate = post.file.length > 0

    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId
        }

        if(hasFileToUpdate) {
            const uploadedFile = await uploadFile(post.file[0])
            if(!uploadedFile) throw Error

            const fileUrl = getFilePreview(uploadedFile.$id)


            if(!fileUrl) {
                deleteFile(uploadedFile.$id)
                throw Error
            }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }

        const tags = post.tags?.replace(/ /g, "").split(",") || []

        const updatePost = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            post.postId,
            {
                
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags
            }
        )
        if(!updatePost) {
            await deleteFile(post.imageId)
            throw Error
        }

        return updatePost

    } catch(error) {
        console.log(error)
    }
}


export async function deletePost(postId: string, imageId: string) {
    if(!postId || !imageId) throw Error

    try {
        await databases.deleteDocument(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            postId
        )

        return { status: 'ok' }

    } catch(error) {
        console.log(error)
    }

}


export async function getInfinitePosts({ pageParam }: {pageParam: number}) {
    const queries: string[] = [Query.orderDesc('$updateAt'), Query.limit(10)]
    if(pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }

    try {
        const posts = await databases.listDocuments<IPost>(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            queries
        )

        if(!posts) throw Error

        return posts

    }catch(error) {
        console.log(error)
    }
}


export async function searchPosts(searchTerm: string) {


    try {
        const posts = await databases.listDocuments<IPost>(
            appwriteconfig.databaseId,
            appwriteconfig.postsTableId,
            [Query.search('caption', searchTerm)]
        )

        if(!posts) throw Error

        return posts

    }catch(error) {
        console.log(error)
    }
}
 