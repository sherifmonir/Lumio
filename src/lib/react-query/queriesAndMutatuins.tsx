import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, followUser, getCurrentUser, getFollowers, getFollowersCount, getFollowing, getFollowingCount, getFollowingRelations, getInfinitePosts, getInfiniteUsers, getLikedPosts, getLikedRelations, getLikesCount, getNotifications, getPostById, getRecentPost, getUnreadNotificationsCount, getUserById, likePost, markAllNotificationsAsRead, savePost, saveUserToDB, searchPosts, searchUsers, signinAccount, signoutAccount, subscribeToNotifications, unfollowUser, unlikePost, updatePost, updateProfile } from '../appwrite/api'
import type { INewPost, INewUser, IUpdatePost, IUpdateProfile } from '@/types'
import { queryKeys } from './queryKeys'
import { useEffect } from 'react'


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
                queryKey: [queryKeys.GET_USER_BY_ID, data?.$id]
            })
        }
    })
}


export const useSearchUsers = (searchTerm: string) => {
    return useQuery({
    queryKey: [queryKeys.SEARCH_USERS, searchTerm],
    queryFn: () => searchUsers(searchTerm),
    enabled: !!searchTerm,
  });
}


export const useGetUsers = () => {
    const usersLimit = 10
    return useInfiniteQuery({
        queryKey: [queryKeys.GET_INFINITE_USERS],
        queryFn: getInfiniteUsers,
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => {
            if (!lastPage?.documents?.length) return null
            if (lastPage.documents.length < usersLimit) return null
            return pages.length + 1
        }
    })
}


export const useFollowUser = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: ({ followerId, followingId }: { followerId: string; followingId: string }) =>
      followUser(followerId, followingId),
    onSuccess: (_data, v) => {
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWERS_COUNT, v.followingId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWING_COUNT, v.followerId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWERS, v.followingId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWING, v.followerId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWING_IDS, v.followerId] });
    },
  });
}


export const useUnfollowUser = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (v: { followDocumentId: string; followerId: string; followingId: string }) =>
      unfollowUser(v.followDocumentId),
    onSuccess: (_data, v) => {
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWERS_COUNT, v.followingId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWING_COUNT, v.followerId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWERS, v.followingId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWING, v.followerId] });
      query.invalidateQueries({ queryKey: [queryKeys.GET_FOLLOWING_IDS, v.followerId] });
    },
  });
};


export const useGetFollowersCount = (userId?: string) => {
  return useQuery({
    queryKey: [queryKeys.GET_FOLLOWERS_COUNT, userId],
    queryFn: () => getFollowersCount(userId!),
    enabled: !!userId,
  })
}


export const useGetFollowingCount = (userId?: string) => {
  return useQuery({
    queryKey: [queryKeys.GET_FOLLOWING_COUNT, userId],
    queryFn: () => getFollowingCount(userId!),
    enabled: !!userId,
  })
}


export const useGetFollowers = (userId?: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.GET_FOLLOWERS, userId],
    queryFn: ({ pageParam = 0 }) => getFollowers({ pageParam, userId: userId! }),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length : null),
    enabled: !!userId && enabled,
    initialPageParam: 0,
  })
}


export const useGetFollowing = (userId?: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.GET_FOLLOWING, userId],
    queryFn: ({ pageParam = 0 }) => getFollowing({ pageParam, userId: userId! }),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length : null),
    enabled: !!userId && enabled,
    initialPageParam: 0,
  })
}


export const useGetFollowingRelations  = (currentUserId?: string) => {
  return useQuery({
    queryKey: [queryKeys.GET_FOLLOWING_IDS, currentUserId],
    queryFn: () => getFollowingRelations(currentUserId!),
    enabled: !!currentUserId,
  })}


export const useLikePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, postId }: { userId: string; postId: string }) => likePost(userId, postId),
    onSuccess: (_data, v) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_LIKED_RELATIONS, v.userId] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_LIKES_COUNT, v.postId] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_LIKED_POSTS, v.userId] })
    },
  })
}

export const useUnlikePost = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (v: { likeDocumentId: string; userId: string; postId: string }) => unlikePost(v.likeDocumentId),
    onSuccess: (_data, v) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_LIKED_RELATIONS, v.userId] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_LIKES_COUNT, v.postId] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_LIKED_POSTS, v.userId] })
    },
  })
}


export const useGetLikedRelations = (userId?: string) =>
  useQuery({
    queryKey: [queryKeys.GET_LIKED_RELATIONS, userId],
    queryFn: () => getLikedRelations(userId!),
    enabled: !!userId,
  })


export const useGetLikesCount = (postId?: string) =>
  useQuery({
    queryKey: [queryKeys.GET_LIKES_COUNT, postId],
    queryFn: () => getLikesCount(postId!),
    enabled: !!postId,
  })


export const useGetLikedPosts = (userId?: string) =>
  useInfiniteQuery({
    queryKey: [queryKeys.GET_LIKED_POSTS, userId],
    queryFn: ({ pageParam = 0 }) => getLikedPosts({ pageParam, userId: userId! }),
    getNextPageParam: (last, pages) => (last.hasMore ? pages.length : null),
    enabled: !!userId,
    initialPageParam: 0,
  })


  export const useGetNotifications = (userId?: string, enabled = true) => {
  return useInfiniteQuery({
    queryKey: [queryKeys.GET_NOTIFICATIONS, userId],
    queryFn: ({ pageParam }) => getNotifications({ pageParam, userId: userId! }),
    getNextPageParam: (last) => (last.hasMore ? last.nextCursor : undefined),
    initialPageParam: undefined as string | undefined,
    enabled: !!userId && enabled,
  })
}


export const useGetUnreadNotificationsCount = (userId?: string) => {
  return useQuery({
    queryKey: [queryKeys.GET_UNREAD_NOTIFICATIONS_COUNT, userId],
    queryFn: () => getUnreadNotificationsCount(userId!),
    enabled: !!userId,
  })
}


export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => markAllNotificationsAsRead(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_NOTIFICATIONS, userId] })
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_UNREAD_NOTIFICATIONS_COUNT, userId] })
    },
  })
}


export const useNotificationsRealtime = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    let isActive = true;
    let subscription: Awaited<ReturnType<typeof subscribeToNotifications>> | null = null;

    subscribeToNotifications(userId, () => {
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_NOTIFICATIONS, userId] });
      queryClient.invalidateQueries({ queryKey: [queryKeys.GET_UNREAD_NOTIFICATIONS_COUNT, userId] });
    }).then((sub) => {
      if (isActive) subscription = sub;
      else sub.unsubscribe();
    });

    return () => {
      isActive = false;
      subscription?.unsubscribe();
    };
  }, [userId, queryClient]);
};