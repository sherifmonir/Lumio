import { ClipLoader } from 'react-spinners'
import { useGetComments, useCreateComment } from '@/lib/react-query/queriesAndMutatuins'
import CommentInput from './CommentInput'
import CommentItem from './CommentItem'

type CommentSectionProps = {
  postId: string
  currentUserId: string
  postOwnerId?: string
}

const CommentSection = ({ postId, currentUserId, postOwnerId }: CommentSectionProps) => {
  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetComments(postId)
  const { mutate: createComment, isPending: isPosting } = useCreateComment()

  const comments = data?.pages.flatMap((page) => page.comments) ?? []

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      <CommentInput
        onSubmit={(content) => createComment({ postId, authorId: currentUserId, content })}
        isSubmitting={isPosting}
      />

      {isPending ? (
        <div className="flex justify-center py-4">
          <ClipLoader />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-light-3 text-sm text-center py-4">No comments yet</p>
      ) : (
        <div className="flex flex-col gap-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.$id}
              comment={comment}
              postId={postId}
              currentUserId={currentUserId}
              postOwnerId={postOwnerId}
            />
          ))}
        </div>
      )}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="text-primary-500 text-sm self-center cursor-pointer">
          {isFetchingNextPage ? "Loading..." : "View more comments"}
        </button>
      )}
    </div>
  )
}

export default CommentSection