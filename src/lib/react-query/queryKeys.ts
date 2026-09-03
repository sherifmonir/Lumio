export const queryKeys = {
  // AUTH KEYS
  CREATE_USER_ACCOUNT: "createUserAccount",

  // USER KEYS
  GET_CURRENT_USER: "getCurrentUser",
  GET_USERS: "getUsers",
  GET_USER_BY_ID: "getUserById",
  UPDATE_PROFILE: "updateProfile",
  SEARCH_USERS: "searchUsers",
  GET_INFINITE_USERS: "getInfiniteUsers",

  // POST KEYS
  GET_POSTS: "getPosts",
  GET_INFINITE_POSTS: "getInfinitePosts",
  GET_RECENT_POSTS: "getRecentPosts",
  GET_POST_BY_ID: "getPostById",
  GET_USER_POSTS: "getUserPosts",
  GET_FILE_PREVIEW: "getFilePreview",

  //  SEARCH KEYS
  SEARCH_POSTS: "getSearchPosts",

  // FOLLOW KEYS
  GET_IS_FOLLOWING: "getIsFollowing",
  GET_FOLLOWERS_COUNT: "getFollowersCount",
  GET_FOLLOWING_COUNT: "getFollowingCount",
  GET_FOLLOWERS: "getFollowers",
  GET_FOLLOWING: "getFollowing",
  GET_FOLLOWING_IDS: "getFollowingIds",
  GET_FOLLOWING_FEED: "getFollowingFeed",

  // LIKE KEYS
  GET_LIKED_RELATIONS: "getLikedRelations",
  GET_LIKES_COUNT: "getLikesCount",
  GET_LIKED_POSTS: "getLikedPosts",

} as const;
