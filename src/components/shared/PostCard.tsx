import { useUserContext } from '@/context/UseUserContext'
import type { Models } from 'appwrite'
import React from 'react'

type PostcardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostcardProps) => {
    const { user } = useUserContext
  if (!post.creator) return;

  return (
    <div>PostCard</div>
  )
}

export default PostCard