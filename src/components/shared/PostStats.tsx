import { useMemo, useState } from 'react'
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useSavePost,
  useGetLikedRelations,
  useLikePost,
  useUnlikePost,
  useGetLikesCount,
} from '@/lib/react-query/queriesAndMutatuins'
import type { IPost, ISave } from '@/types'

type PostStatsProps = {
    post?: IPost
    userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
    const { data: relations, isPending: isCheckingLike } = useGetLikedRelations(userId)
    const { data: likesCount } = useGetLikesCount(post?.$id)
    const { mutateAsync: likePost } = useLikePost()
    const { mutateAsync: unlikePost } = useUnlikePost()

    const existingLike = useMemo(
        () => relations?.find((r) => r.postId === post?.$id) ?? null,
        [relations, post?.$id]
    )

    const [optimistic, setOptimistic] = useState<boolean | null>(null)
    const [prevServerState, setPrevServerState] = useState(!!existingLike)
    if (!!existingLike !== prevServerState) {
        setPrevServerState(!!existingLike)
        setOptimistic(null)
    }

    const isLiked = optimistic ?? !!existingLike
    const displayLikesCount = (likesCount ?? 0) + (optimistic === null ? 0 : optimistic ? 1 : -1)

    const { data: currentUser } = useGetCurrentUser()
    const { mutate: savePost } = useSavePost()
    const { mutate: deleteSavedPost } = useDeleteSavedPost()

    const savedPostRecord = currentUser?.save?.find(
        (record: ISave) => record.post?.$id === post?.$id
    )
    const isSaved = !!savedPostRecord

    const handleLikePost = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (isLiked) {
            setOptimistic(false)
            try {
                await unlikePost({ likeDocumentId: existingLike!.$id, userId, postId: post?.$id || "" })
            } catch {
                setOptimistic(true)
            }
        } else {
            setOptimistic(true)
            try {
                await likePost({ userId, postId: post?.$id || "" })
            } catch {
                setOptimistic(false)
            }
        }
    }

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (savedPostRecord) {
            deleteSavedPost(savedPostRecord.$id)
        } else {
            savePost({ userId, postId: post?.$id || ""})
        }
    }

  return (
    <div className="flex justify-between items-center z-20">

        <div className="flex gap-2 mr-5">
            <img
                src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                alt="like"
                width={20}
                height={20}
                onClick={isCheckingLike ? undefined : handleLikePost}
                className="cursor-pointer"
            />
            <p className="small-meduim lg:base-meduim">
                {displayLikesCount}
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