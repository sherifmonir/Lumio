import { useState } from 'react'
import { Link } from 'react-router-dom'
import { multiFormatDateString } from '@/lib/utils'
import { useCreateComment, useDeleteComment } from '@/lib/react-query/queriesAndMutatuins'
import CommentInput from './CommentInput'
import type { ICommentWithAuthor } from '@/types'

type CommentItemProps = {
  comment: ICommentWithAuthor
  postId: string
  currentUserId: string
  postOwnerId?: string
}

const CommentItem = ({ comment, postId, currentUserId, postOwnerId }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const { mutate: createComment, isPending: isReplyPending } = useCreateComment()
  const { mutate: deleteComment } = useDeleteComment()

  const canDelete = (authorId: string) => currentUserId === authorId || currentUserId === postOwnerId

  const handleReply = (content: string) => {
    createComment(
      { postId, authorId: currentUserId, content, parentCommentId: comment.$id },
      { onSuccess: () => setIsReplying(false) }
    )
  }

  if (!comment.author) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${comment.author.$id}`}>
          <img src={comment.author.imageUrl} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover" />
        </Link>
        <div className="flex-1">
          <p className="text-sm text-white">
            <Link to={`/profile/${comment.author.$id}`} className="font-semibold mr-1">
              {comment.author.name}
            </Link>
            {comment.content}
          </p>
          <div className="flex gap-3 mt-1 text-xs text-light-3">
            <span>{multiFormatDateString(comment.$createdAt)}</span>
            <button onClick={() => setIsReplying((prev) => !prev)}>Reply</button>
            {canDelete(comment.authorId) && (
              <button onClick={() => deleteComment({ commentId: comment.$id, postId })}>Delete</button>
            )}
          </div>

          {isReplying && (
            <div className="mt-2">
              <CommentInput
                onSubmit={handleReply}
                isSubmitting={isReplyPending}
                placeholder={`Reply to ${comment.author.name}...`}
                onCancel={() => setIsReplying(false)}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies.length > 0 && (
        <div className="ml-11 flex flex-col gap-3">
          {comment.replies.map((reply) =>
            !reply.author ? null : (
              <div key={reply.$id} className="flex items-start gap-3">
                <Link to={`/profile/${reply.author.$id}`}>
                  <img src={reply.author.imageUrl} alt={reply.author.name} className="w-7 h-7 rounded-full object-cover" />
                </Link>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <Link to={`/profile/${reply.author.$id}`} className="font-semibold mr-1">
                      {reply.author.name}
                    </Link>
                    {reply.content}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-light-3">
                    <span>{multiFormatDateString(reply.$createdAt)}</span>
                    {canDelete(reply.authorId) && (
                      <button onClick={() => deleteComment({ commentId: reply.$id, postId })}>Delete</button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

export default CommentItem