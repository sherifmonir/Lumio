import UserCard from "@/components/shared/UserCard";
import { useGetFollowers, useGetFollowing } from "@/lib/react-query/queriesAndMutatuins";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";



const FollowList = () => {
  const { id: userId } = useParams<{ id: string}>()
  const { ref, inView } = useInView()
  const { pathname } = useLocation()
  const mode = pathname.endsWith("/following") ? "following" : "followers"
  const followers = useGetFollowers(userId, mode === "followers")
  const following = useGetFollowing(userId, mode === "following")
  const { data, fetchNextPage, hasNextPage, isFetching } = mode === "followers" ? followers : following

  useEffect(() => {
     if (inView && hasNextPage)
         fetchNextPage() },
        [inView, hasNextPage,fetchNextPage])


  const users = data?.pages.flatMap((page) => page.users) ?? []

  if (!users.length && !isFetching) {
    return <p className="text-light-4 text-center w-full mt-8">
      {mode === "followers" ? "No followers yet" : "Not following anyone yet"}
    </p>
  }

  return (
    <ul className="user-grid-container">
      {users.map((user) => (
        <li key={user.$id} className="flex-1 min-w-50">
            <UserCard user={user} />
        </li>
      ))}
      {hasNextPage &&
        <div ref={ref} className="mt-4 flex justify-center w-full">
            <ClipLoader />
        </div>}
    </ul>
  )
}

export default FollowList