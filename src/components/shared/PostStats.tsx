import type { Models } from 'appwrite'

type PostStatsProps = {
    post: Models.Document
    userId: string
}

const PostStats = ({post, userId}: PostStatsProps) => {
  return (
    <div className="flex justify-between items-center z-20">

        <div className="flex gap-2 mr-5">
            <img
                src="/assests/icons/like.svg"
                alt="like"
                width={20}
                height={20}
                onClick={() => {}}
                className="cursor-pointer"
            />
            <p className="small-meduim lg:base-meduim">
                0
            </p>
        </div>

        <div className="flex gap-2">
            <img
                src="/assests/icons/save.svg"
                alt="save"
                width={20}
                height={20}
                onClick={() => {}}
                className="cursor-pointer"
            />
        </div>

    </div>
  )
}

export default PostStats