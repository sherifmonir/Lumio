import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, createUserAccount, deleteSavedPost, getCurrentUser, getRecentPost, likePost, savePost, saveUserToDB, signinAccount, signoutAccount } from '../appwrite/api'
import type { INewPost, INewUser } from '@/types'
import { queryKeys } from './queryKeys'

export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })

}


export const useSigninAccount = () => {
    return useMutation({
        mutationFn: (user:{email:string, password:string}) => signinAccount(user)
    })

}


export const useSaveUserToDB = () => {
    return useMutation({
        mutationFn:(user: {
      accountId: string;
      email: string;
      name: string;
      imageUrl: string;
      username?: string;
    }) => saveUserToDB(user)
    })
}


export const useSignoutAccount = () => {
    return useMutation({
        mutationFn: signoutAccount
    })

}


export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_RECENT_POSTS]
            })
        }
    })

}


export const useGetRecentPosts = () => {
    return useQuery({
        queryKey: [queryKeys.GET_RECENT_POSTS],
        queryFn: getRecentPost
    })
}


export const useLikePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, likesArr }: {postId: string, likesArr: string[]})=> likePost(postId, likesArr),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CURRENT_USER]
            })
        }
    })
}


export const useSavePost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ postId, userId }: {postId: string, userId: string}) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CURRENT_USER]
            })
        }
    })
}


export const useDeleteSavedPost = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_CURRENT_USER]
            })
        }
    })
}


export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [queryKeys.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}