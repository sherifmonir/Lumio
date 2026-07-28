import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPost, getUserById, likePost, savePost, saveUserToDB, searchPosts, signinAccount, signoutAccount, updatePost, updateProfile } from '../appwrite/api'
import type { INewPost, INewUser, IUpdatePost, IUpdateProfile } from '@/types'
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


export const useGetPostById = (postId: string) => {
    return useQuery({
        queryKey: [queryKeys.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
    })
}


export const useUpdatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}


export const useDeletePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string}) => deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.GET_RECENT_POSTS]
            })
        }
    })
}


export const useGetPosts = () => {
    const postsLimit = 10
    return useInfiniteQuery({
        queryKey: [queryKeys.GET_INFINITE_POSTS],
        queryFn: getInfinitePosts,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage?.documents?.length) return null
            if (lastPage.documents.length < postsLimit) return null
            return pages.length + 1
        }
    })
}


export const useSearchPosts = (searchTerm: string) => {
    return useQuery({
        queryKey: [queryKeys.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPosts(searchTerm),
        enabled: !!searchTerm
    })
}


export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [queryKeys.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId
    })
}


export const useUpdateProfile = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (profile: IUpdateProfile) => updateProfile(profile),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [queryKeys.UPDATE_PROFILE, data?.$id]
            })
        }
    })
}