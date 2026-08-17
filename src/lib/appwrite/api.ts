import type { IFollow, INewPost, INewUser, IPost, IUpdatePost, IUpdateProfile, IUser } from "@/types";
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
                Query.select(['*', 'save.*', 'save.post.*', 'liked.*'])
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

        const updatedPost = await databases.updateDocument(
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
        if(!updatedPost) {
            await deleteFile(post.imageId)
            throw Error
        }

        return updatedPost

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
    const queries: string[] = [
         Query.orderDesc('$updatedAt'),
         Query.limit(10),Query.offset((pageParam - 1) * 10),
         Query.select(['*', 'creator.*'])
        ]

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
  const cleanedTerm = searchTerm.replace(/^#+/, '').trim() // strip any leading '#'s before matching

    try {
        const [byCaption, byTag] = await Promise.all([
            databases.listDocuments<IPost>(
                appwriteconfig.databaseId,
                appwriteconfig.postsTableId,
                [Query.search('caption', searchTerm)]
            ),
            databases.listDocuments<IPost>(
                appwriteconfig.databaseId,
                appwriteconfig.postsTableId,
                [Query.contains('tags', cleanedTerm)]
            )
        ])

        const merged = [...byCaption.documents,...byTag.documents]
        const unique = Array.from(new Map(merged.map((u) => [u.$id, u])).values())

        return { documents: unique, total: unique.length }

    }catch(error) {
        console.log(error)
        return null
    }
}


export async function getUserById(userId: string) {

    try{
        const user = await databases.getDocument<IUser>(
            appwriteconfig.databaseId,
            appwriteconfig.usersTableId,
            userId,
            [Query.select(['*', 'posts.*'])]
        )
        return user

    }catch(error){
        console.log(error)
    }

}


export async function updateProfile(profile: IUpdateProfile) {
    const hasFileToUpdate = profile.file.length > 0

    try {
        let image = {
            imageUrl: profile.imageUrl,
            imageId: profile.imageId
        }

        if(hasFileToUpdate) {
            const uploadedFile = await uploadFile(profile.file[0])
            if(!uploadedFile) throw Error

            const fileUrl = getFilePreview(uploadedFile.$id)


            if(!fileUrl) {
                deleteFile(uploadedFile.$id)
                throw Error
            }
            image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id}
        }

        

        const updatedProfile = await databases.updateDocument(
            appwriteconfig.databaseId,
            appwriteconfig.usersTableId,
            profile.$id,
            {
                accountId: profile.accountId,
                name: profile.name,
                username: profile.username,
                email: profile.email,
                bio: profile.bio,
                imageUrl: image.imageUrl,
                imageId: image.imageId
            }
        )
        

        return updatedProfile

    } catch(error) {
        console.log(error)
    }
}


export async function getUsers(limit?: number) {
  const queries = [Query.orderDesc("$createdAt")];

  if (limit) {
    queries.push(Query.limit(limit));
  }

  try {
    const users = await databases.listDocuments<IUser>(
      appwriteconfig.databaseId,
      appwriteconfig.usersTableId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
}


export async function searchUsers(searchTerm: string) {
  try {
        const users = await databases.listDocuments<IUser>(
            appwriteconfig.databaseId,
            appwriteconfig.usersTableId,
            [Query.search("name", searchTerm.toLowerCase())]
        );

        if (!users) throw new Error()

        return users
  } catch (error) {
    console.log(error)
    return null
  }
}


export async function getInfiniteUsers({ pageParam }: {pageParam: number}) {
    const queries: string[] = [Query.orderDesc('$updatedAt'), Query.limit(10),Query.offset((pageParam - 1) * 10)]

    try {
        const users = await databases.listDocuments<IUser>(
            appwriteconfig.databaseId,
            appwriteconfig.usersTableId,
            queries
        )

        if(!users) throw Error

        return users

    }catch(error) {
        console.log(error)
    }
}


export async function followUser(followerId: string, followingId: string) {
    return databases.createDocument<IFollow>(
        appwriteconfig.databaseId,
        appwriteconfig.followsTableId,
        ID.unique(),
        { followerId, followingId },
        [
            Permission.read(Role.users()),
            Permission.delete(Role.users()),
        ])
}


export async function unfollowUser(followDocumentId: string) {
    return databases.deleteDocument(
        appwriteconfig.databaseId,
        appwriteconfig.followsTableId,
        followDocumentId
    )
}


export async function checkIsFollowing(followerId: string, followingId: string) {
    const res = await databases.listDocuments<IFollow>(
        appwriteconfig.databaseId,
        appwriteconfig.followsTableId,
        [
            Query.equal('followerId', followerId),
            Query.equal('followingId', followingId),
            Query.limit(1)
        ])
        return res.documents[0] ?? null
}


export async function getFollowersCount(userId: string) {
    const res = await databases.listDocuments<IFollow>(
        appwriteconfig.databaseId,
        appwriteconfig.followsTableId,
        [
            Query.equal('followingId', userId),
            Query.limit(1)
        ])
    return res.total
}


export async function getFollowingCount(userId: string) {
    const res = await databases.listDocuments<IFollow>(
        appwriteconfig.databaseId,
        appwriteconfig.followsTableId,
        [
            Query.equal('followerId', userId),
            Query.limit(1)
        ])
    return res.total
}

const FOLLOW_PAGE_SIZE = 12
export async function getFollowers({ pageParam,userId }: {pageParam: number, userId: string}) {
    const follows = await databases.listDocuments<IUser>(
        appwriteconfig.databaseId,
        appwriteconfig.followsTableId,
        [
            Query.equal('followingId', userId),
            Query.orderDesc('$createdAt'),
            Query.limit(FOLLOW_PAGE_SIZE),
            Query.offset((pageParam) * FOLLOW_PAGE_SIZE)
        ])
    if(!follows.documents.length) return { users: [], hasMore: false }

    return { 
        users: follows.documents, 
        hasMore: true 
    }
}


export async function getFollowing({ pageParam, userId }: { pageParam: number; userId: string }) {
  const follows = await databases.listDocuments<IFollow>(
    appwriteconfig.databaseId,
    appwriteconfig.followsTableId,
    [
        Query.equal('followerId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(FOLLOW_PAGE_SIZE),
        Query.offset(pageParam * FOLLOW_PAGE_SIZE)
    ]
  )
  if (!follows.documents.length) return { users: [], hasMore: false };

  const ids = follows.documents.map((f) => f.followingId)
  const users = await databases.listDocuments<IUser>(
    appwriteconfig.databaseId,
    appwriteconfig.usersTableId,
    [Query.equal('$id', ids)]
  )
  return { users: users.documents, hasMore: follows.documents.length === FOLLOW_PAGE_SIZE }
}


export async function getFollowingRelations(followerId: string) {
  const res = await databases.listDocuments<IFollow>(
    appwriteconfig.databaseId,
    appwriteconfig.followsTableId,
    [
        Query.equal('followerId', followerId),
        Query.limit(500)
    ])
  return res.documents
}

