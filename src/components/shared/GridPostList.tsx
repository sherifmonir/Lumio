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
  console.log(posts[0])
  const { user } = useUserContext()
  return (
    <ul className="grid-container ">
      {posts.map((post) => (
        <li key={post.$id} className="relative min-w-80 h-80">
          <Link to={`/post/${post.$id}`} className="grid-post-link">
            <img
              src={getFilePreview(post.imageId)}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post-user">
            {showUser && (
              <Link to={`/post/${post.creator.$id}`} className="flex items-center justify-start gap-2 flex-1 ">
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
      ))}
    </ul>
  )
}

export default GridPostList