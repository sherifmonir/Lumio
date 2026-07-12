import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from '@/lib/react-query/queriesAndMutatuins'
import { checkIsLiked } from '@/lib/utils'
import type { IPost, ISave } from '@/types'
import { useState } from 'react'


type PostStatsProps = {
    post: IPost
    userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const likesList = post.likes?.map((user) => user.$id) ?? []
   
    const { mutate: likePost } = useLikePost()
    const { mutate: savePost, isPending: isSavingPost } = useSavePost()
    const { mutate: deleteSavedPost, isPending: isDeletingSavedPost } = useDeleteSavedPost()
    const { data: currentUser } = useGetCurrentUser()

    console.log('currentUser:', currentUser)
console.log('currentUser.save:', currentUser?.save)

    const savedPostRecord = currentUser?.save?.find(
        (record: ISave) => record.post?.$id === post.$id
    )

    const isSaved = !!savedPostRecord

    const [likes, setLikes] = useState(likesList)
    


    


    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        const hasLiked = likes.includes(userId)
        const newLikes = hasLiked
        ?likes.filter((id) => id!== userId)
        :[...likes, userId]
        setLikes(newLikes)
        likePost({postId: post.$id, likesArr: newLikes},
            {
                onError: () => {
                    setLikes(likes)
                }
            }
        )
    }

    const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();


    if (savedPostRecord) {
        deleteSavedPost(savedPostRecord.$id)
    } else {
        savePost({ userId, postId: post.$id })
    }

    }

  return (
    <div className="flex justify-between items-center z-20">

        <div className="flex gap-2 mr-5">
            <img
                src={checkIsLiked(likes, userId)
                ? "/assets/icons/liked.svg"
                : "/assets/icons/like.svg"}
                alt="like"
                width={20}
                height={20}
                onClick={handleLikePost}
                className="cursor-pointer"
            />
            <p className="small-meduim lg:base-meduim">
                {likes.length}
            </p>
        </div>

        <div className="flex gap-2">

                <img
                    src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                    alt="save"
                    width={20}
                    height={20}
                    onClick={handleSavePost}
                    className="cursor-pointer"
                />
            
        </div>

    </div>
  )
}

export default PostStats