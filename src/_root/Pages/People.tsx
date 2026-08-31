import UserCard from "@/components/shared/UserCard";
import UsersSearchResults from "@/components/shared/UsersSearchResults";
import { useUserContext } from "@/context/UseUserContext";
import { useDebounce } from "@/Hooks/useDebounce";
import { useGetFollowingRelations, useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutatuins";
import { useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ClipLoader } from "react-spinners";



const People = () => {
  const [searchValue, setSearchValue] = useState('')
  const { ref, inView } = useInView()
  const debouncedSearch = useDebounce(searchValue, 500)
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedSearch)
  const { data: users, fetchNextPage, hasNextPage } = useGetUsers()
  const searchValueRef = useRef<HTMLInputElement>(null)
  const { user } = useUserContext()
  const { data: relations } = useGetFollowingRelations(user.id)
  const followingIds = useMemo(() => relations?.map((r) => r.followingId) ?? [], [relations])

const usersMemo = useMemo(() => {
  if (!users?.pages) return []
  const followed = new Set(followingIds)
  const allUsers = users.pages.flatMap((page) => page?.documents ?? []).filter((u) => u.$id !== user.id)

  const notFollowed: typeof allUsers = []
  const followedDocs: typeof allUsers = []
  for (const u of allUsers) (followed.has(u.$id) ? followedDocs : notFollowed).push(u)

  return [{ documents: [...notFollowed, ...followedDocs] }]
}, [users, followingIds, user.id])



    const handleSearchIconClick = () => {
      searchValueRef.current?.focus()
    }

  useEffect(() => {
      if (inView && !searchValue) {
        fetchNextPage();
      }
    }, [inView, searchValue,fetchNextPage]);
  

  
  if(!users) {
    return (
      <div className="flex-center w-full h-full">
        <ClipLoader />
      </div>
    )
  }

  const showSearchResults = searchValue !== ""
  const shouldShowUsers = !showSearchResults && usersMemo.every((page) => page.documents.length === 0)

  return (
    <div className="common-container">
      <div className="explore-inner-container">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Users
        </h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4 explore-search">
          <img
            src="/assets/icons/search.svg"
            width={20}
            height={20}
            alt="search"
            className="cursor-pointer fill-primary-500"
            onClick={handleSearchIconClick}
          />
          <input
            ref={searchValueRef}
            type="text"
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const { value } = e.target
              setSearchValue(value)
            }}
            />
                
        </div>
      </div>
      <div className="people-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">People</h2>
        {showSearchResults ? (
          <UsersSearchResults
            isSearchFetching={isSearchFetching}
            searchedUsers={searchedUsers ?? { documents: [] }}
          />
        ) :  shouldShowUsers ? (
          <p className="text-light-4 mt-10 text-center w-full">No More Results</p>
        ) : (
          <ul className="user-grid-container">
            {usersMemo.map((page) =>
              page.documents.map((u) => (
                <li key={u?.$id} className="flex-1 min-w-50 w-full">
                  <UserCard user={u} />
                </li>
              ))
            )}
          </ul>
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <ClipLoader />
        </div>
      )}
    </div>

  )
}


export default People