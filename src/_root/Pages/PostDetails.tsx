import PostStats from "@/components/shared/PostStats"
import { useUserContext } from "@/context/UseUserContext"
import { useDeletePost, useGetPostById } from "@/lib/react-query/queriesAndMutatuins"
import { multiFormatDateString } from "@/lib/utils"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ClipLoader } from "react-spinners"

const PostDetails = () => {
  const { id } = useParams()
  const { data: post, isPending } = useGetPostById(id || '')
  const { user } = useUserContext();
  const navigate = useNavigate()
  const {mutate: deletePost} = useDeletePost()
  
  const handleDeletePost = () => {
    deletePost({ postId: id || '', imageId: post?.imageId || '' });
    navigate(-1);

  }

  return (
  <div className="post-details-container">

    <div className="md-flex max-w-5xl w-full">

      <button
        onClick={() => navigate(-1)}
        className="shad-button-ghost">

      <img
        src="/assets/icons/back.svg"
        alt="back"
        width={24}
        height={24}
       />
       <p className="small-meduim lg:base-meduim">Back</p>

      </button>

    </div>

    {isPending || !post ? <ClipLoader />: (

    <div className="post-details-card">
      <img
            src={post?.imageUrl}
            alt="post"
            className="post-details-img"
          />

      <div className="post-details-info">

        <div className="flex-between w-full">

          <Link
            to={`/profile/${post?.creator.$id}`}
            className="flex items-center gap-3">
              <img
                  src={post?.creator.imageUrl ||"/assets/icons/profile-placeholder.svg"}
                  alt="creator"
                  className="w-8 h-8 lg:w-12 lg:h-12 rounded-full"
                />

          
          

            <div className="flex flex-col gap-1">

              <p className="base-meduim lg:body-bold text-light-1subtle-semibold">
                {post?.creator.name}
              </p>

            <div className="flex-center gap-2 text-light-3">

              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post?.$createdAt)}
              </p>

              <p className="subtle-semibold lg:small-regular">
                {post?.location}
              </p>

            </div>

            </div>
          </Link>

        <div className="flex-center gap-4">

          <Link to={`/update-post/${post?.$id}`}
            className={`${user.id !== post?.creator.$id && "hidden"}`}>

            <img 
              src="/assets/icons/edit.svg" 
              alt="edit"
              width={24}
              height={24}
            />

        </Link>

        <button
          onClick={handleDeletePost}
          className={`post-details-delete-btn ${user.id !== post?.creator.$id && "hidden"}`}>

            <img
              src={"/assets/icons/delete.svg"}
              alt="delete"
              width={24}
              height={24}
            />
        </button>
      </div>
    </div>


    <hr className="border w-full border-dark-4/80" />

      <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
        <p>{post?.caption}</p>
        <ul className="flex gap-1 mt-2">
            {post.tags?.map((tag: string, index: number) => (
              <li
                key={index}
                className="text-light-3 small-regular">
                    #{tag}
               </li>
            ))}
          </ul>
      </div>

      <div className="w-full">
        <PostStats post={post} userId={user.id} />
      </div>
    </div>
  </div>




    )}

  </div>
  )
}

export default PostDetails