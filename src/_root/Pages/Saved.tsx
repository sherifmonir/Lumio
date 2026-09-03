import GridPostList from "@/components/shared/GridPostList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutatuins"
import type { ISave } from "@/types";
import { useMemo } from "react";
import { ClipLoader } from "react-spinners";


  const Saved = () => {
    const { data: currentUser } = useGetCurrentUser()
    

    const savedPosts = currentUser?.save

    const savePosts = useMemo(() => {
  if (!savedPosts) return []
  return [...savedPosts]
    .sort((a: ISave, b: ISave) => new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime())
    .map((savePost: ISave) => ({ ...savePost.post }))
}, [savedPosts])
  
  return (
    <div className="liked-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        <ClipLoader />
      ) : (
        <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savePosts.length === 0 ? (
            <p className="text-light-4">No available posts</p>
          ) : (
            <GridPostList posts={savePosts} showUser={false} showStats={true} />
          )}
        </ul>
      )}
    </div>
  )
}



export default Saved