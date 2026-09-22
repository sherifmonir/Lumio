import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { multiFormatDateString } from '@/lib/utils'
import { useCreateComment, useDeleteComment } from '@/lib/react-query/queriesAndMutatuins'
import CommentInput from './CommentInput'
import type { ICommentWithAuthor } from '@/types'
import ConfirmationModal from './ConfirmationModal'

type CommentItemProps = {
  comment: ICommentWithAuthor
  postId: string
  currentUserId: string
  postOwnerId?: string
}

const CommentItem = ({ comment, postId, currentUserId, postOwnerId }: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const navigate = useNavigate()
  const { mutate: createComment, isPending: isReplyPending } = useCreateComment()
  const { mutate: deleteComment, isPending: isDeletingComment } = useDeleteComment()
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)


  const canDelete = (authorId: string) => currentUserId === authorId || currentUserId === postOwnerId

  const handleReply = (content: string) => {
    createComment(
      { postId, authorId: currentUserId, content, parentCommentId: comment.$id },
      { onSuccess: () => setIsReplying(false) }
    )
  }

  if (!comment.author) return null

  const handleDeleteComment = () => {
    deleteComment(
      { commentId: comment.$id, postId },
      {
        onSuccess: () => {
          if (comment.replies.length > 0) {
            comment.replies.forEach((reply) => {
            deleteComment({ commentId: reply.$id, postId })
            console.log("reply deleted")
            })
          }
          setIsCommentModalOpen(false)
          navigate(`/post/${postId}`)
        },
      }
    )
  }
  const handleDeleteReply = (replyId: string) => {
    deleteComment(
      { commentId: replyId, postId },
      {
        onSuccess: () => {
          setIsReplyModalOpen(false)
          navigate(`/post/${postId}`)
        },
      }
    )
  }


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
            <button className="cursor-pointer" onClick={() => setIsReplying((prev) => !prev)}>Reply</button>
            {canDelete(comment.authorId) && (
              <>
              <button className="cursor-pointer" onClick={() => setIsCommentModalOpen(true)}>Delete</button>
              <ConfirmationModal
                loadingLabel="Deleting"
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                onConfirm={handleDeleteComment}
                title="Delete Comment"
                description="Are you sure you want to delete this Comment?"
                confirmLabel="Delete"
                isLoading={isDeletingComment}
                variant= "danger"
              />
              </>
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
              <div key={reply.$id} className="flex items-start gap-3 cursor-pointer">
                <Link to={`/profile/${reply.author.$id}`}>
                  <img src={reply.author.imageUrl} alt={reply.author.name} className="w-7 h-7 rounded-full object-cover cursor-pointer" />
                </Link>
                <div className="flex-1">
                  <p className="text-sm text-white">
                    <Link to={`/profile/${reply.author.$id}`} className="font-semibold mr-1 cursor-pointer">
                      {reply.author.name}
                    </Link>
                    {reply.content}
                  </p>
                  <div className="flex gap-3 mt-1 text-xs text-light-3">
                    <span>{multiFormatDateString(reply.$createdAt)}</span>
                    {canDelete(reply.authorId) && (
                      <>
                      <button className="cursor-pointer" onClick={() => setIsReplyModalOpen(true)}>Delete</button>
                      <ConfirmationModal
                        loadingLabel="Deleting"
                        isOpen={isReplyModalOpen}
                        onClose={() => setIsReplyModalOpen(false)}
                        onConfirm={() => handleDeleteReply(reply.$id)}
                        title="Delete Reply"
                        description="Are you sure you want to delete this Reply?"
                        confirmLabel="Delete"
                        isLoading={isDeletingComment}
                        variant= "danger"
                      />
                      </>
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