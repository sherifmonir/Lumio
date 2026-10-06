import { Link } from "react-router-dom"
import { useUserContext } from "@/context/UseUserContext"
import PostStats from "./PostStats"
import type { IPost } from "@/types"
import { getFilePreview } from "@/lib/appwrite/api"


type GridPostListProps = {
  posts: IPost[]
  showUser?: boolean
  showStats?: boolean
}

const GridPostList = ({ posts = [], showUser = true, showStats = true }:GridPostListProps) => {
  const { user } = useUserContext()
  return (
    <div>
    <ul className="post-grid-container">
      {posts.map((post, index) => {
        const isFirstPost = index === 0
        return (
        <li key={post.$id} className="relative gap-4 w-80  h-80 rounded-3xl  ">
          <Link to={`/post/${post.$id}`} className="grid-post-link shadow-lg ">
            <img
              src={getFilePreview(post.imageId)}
              alt="post"
              loading={isFirstPost ? "eager" : "lazy"}
              fetchPriority={isFirstPost ? "high" : "auto"}
              className="h-auto w-full object-cover aspect-video"
            />
          </Link>

          <div className="grid-post-user">
            {showUser && (
              <Link to={`/profile/${post.creator.$id}`} className="flex items-center justify-start gap-2 flex-1">
                <img
                  src={post.creator.imageUrl}

                  alt="creator"
                  className="w-8 h-8 rounded-full"
                />
                <p className="line-clamp-1">{post?.creator.name}</p>
              </Link>
            )}
            {showStats && <PostStats post={post} userId={user.id} />}
          </div>
        </li>
        )
      })}
    </ul>
    </div>
  )
}

export default GridPostList