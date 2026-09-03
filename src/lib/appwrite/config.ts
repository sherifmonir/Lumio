import { Client, Account, Databases, Storage, Avatars} from "appwrite"

export const appwriteconfig = {
    url: import.meta.env.VITE_APPWRITE_URL,
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
    bucketId: import.meta.env.VITE_APPWRITE_BUCKET_ID,
    usersTableId: import.meta.env.VITE_APPWRITE_USERS_TABLE_ID,
    postsTableId: import.meta.env.VITE_APPWRITE_POSTS_TABLE_ID,
    savesTableId: import.meta.env.VITE_APPWRITE_SAVES_TABLE_ID,
    followsTableId: import.meta.env.VITE_APPWRITE_FOLLOWS_TABLE_ID,
    likesTableId: import.meta.env.VITE_APPWRITE_LIKES_TABLE_ID
}

export const client = new Client()
  .setEndpoint(appwriteconfig.url)
  .setProject(appwriteconfig.projectId)

;(client ).headers['X-Sdk-Platform'] = 'web'

export const account = new Account(client)
export const databases = new Databases(client)
export const storage = new Storage(client)
export const avatars = new Avatars(client)