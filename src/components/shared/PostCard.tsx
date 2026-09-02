import { useUserContext } from '@/context/UseUserContext'
import { multiFormatDateString } from '@/lib/utils';
import { Link } from 'react-router-dom';
import PostStats from './PostStats';
import type {  IPost } from '@/types';
import { getFilePreview } from '@/lib/appwrite/api';


type PostCardProps = {
  post: IPost
};


const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext()
  if (!post.creator) return;

  return (

    <div className="post-card">

      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.creator.$id}`}>
          <img
<<<<<<< HEAD
            src={post.creator.imageUrl}
=======
            src={user.imageUrl}
>>>>>>> 50199f104dbf3f46397349842b01e1e912203278
            alt="creator"
            className="rounded-full w-12 lg:h-12 cursor-pointer"
          />
          </Link>
          <div className="flex flex-col">
            <p className="base-meduim lg:body-bold text-light-1subtle-semibold">
              {post.creator.name}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              <p className="subtle-semibold lg:small-regular">
                {post.location}
              </p>
            </div>
          </div>
        </div>
        <Link to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img 
            src="/assets/icons/edit.svg" 
            alt="edit"
            width={20}
            height={20}
          />
        </Link>
      </div>

      <Link to={`/post/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
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
        <img
          src={getFilePreview(post.imageId)}
          alt="post image"
          className="post-card_img" />
      </Link>

      <PostStats post={post} userId={user.id}/>

    </div>
  )
}

export default PostCard