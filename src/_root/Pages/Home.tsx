import PostCard from '@/components/shared/PostCard'
import { useUserContext } from '@/context/UseUserContext'
import {  useGetFollowingRelations, useGetRecentPosts } from '@/lib/react-query/queriesAndMutatuins'
import { useMemo } from 'react'
import { ClipLoader } from "react-spinners"



const Home = () => {
  const { user } = useUserContext()
  const { data: relations } = useGetFollowingRelations(user.id)
  const followingIds = useMemo(() => relations?.map((r) => r.followingId) ?? [], [relations]);  
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts()

  const postsMemo = useMemo(() => {
  if (!posts?.documents) return []
  if (!followingIds?.length) return posts.documents;
  const followed = new Set(followingIds)
  const a: typeof posts.documents = []
  const b: typeof posts.documents = []
  for (const post of posts.documents) (followed.has(post.creator.$id) ? a : b).push(post);
  return [...a, ...b]
}, [posts, followingIds])


  return (
   <div className="flex flex-1 ">
    <div className="home-container overflow-auto scrollbar-none">
      <div className="home-posts">
        <h2 className="h3-bold md:h2-bold text-left w-full">
          Home Feed
        </h2>
        {isPostLoading && !posts ?(
          <ClipLoader />
        ):(
        <ul className="flex flex-col flex-1 gap-9 w-full">
          {postsMemo?.map((post) =>(
            <li key={post.$id} >
            <PostCard  post={post} />
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
   </div> 
)
}

export default Home