import PostForm from '@/components/forms/PostForm'
import { useGetPostById } from '@/lib/react-query/queriesAndMutatuins'
import type { IPost } from '@/types'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

const EditePost = () => {

  const { id } = useParams()
  const {data: post, isPending } = useGetPostById(id || '')

  if(isPending) return <ClipLoader />

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">
              Edite Post
            </h2>
        </div>
        <PostForm action="Update" post={post as unknown as IPost} />
      </div>
    </div>
  )
}

export default EditePost