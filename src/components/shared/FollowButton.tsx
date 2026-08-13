import { useUserContext } from '@/context/UseUserContext';
import {  useFollowUser, useGetFollowingRelations, useUnfollowUser } from '@/lib/react-query/queriesAndMutatuins';
import { useMemo, useState } from 'react'


type FollowButtonProps = { targetUserId: string };


const FollowButton = ({ targetUserId }: FollowButtonProps) => {
    const { user } = useUserContext()
    const { data: relations, isPending } = useGetFollowingRelations(user.id)
    const existingFollow = useMemo(
      () => relations?.find((f) => f.followingId === targetUserId) ?? null,
      [relations, targetUserId]
    )
    const { mutateAsync: follow } = useFollowUser()
    const { mutateAsync: unfollow } = useUnfollowUser()
    const [ optimistic, setOptimistic ] = useState<boolean | null>(null)
    const [ prevServerState, setPrevServerState ] = useState(!!existingFollow)

    if(!!existingFollow !== prevServerState) {
        setPrevServerState(!!existingFollow)
        setOptimistic(null)
    }

    if (user.id === targetUserId) return null

    const isFollowing = optimistic ?? !!existingFollow

    const handleClick = async () => {
    if (isFollowing) {
      setOptimistic(false);
      try {
        await unfollow({ followDocumentId: existingFollow!.$id, followerId: user.id, followingId: targetUserId })
      } catch {
        setOptimistic(true);
      }
    } else {
      setOptimistic(true);
      try {
        await follow({ followerId: user.id, followingId: targetUserId })
      } catch {
        setOptimistic(false);
      }
    }
  };


  return (
    <button type="button"  disabled={isPending} onClick={handleClick} className={isFollowing ? "unfollow" : "follow"}>
      {isFollowing ? "Following" : "Follow"}
    </button>
  )
}

export default FollowButton