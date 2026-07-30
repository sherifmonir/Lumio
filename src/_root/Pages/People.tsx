import UserCard from "@/components/shared/UserCard";
import UsersSearchResults from "@/components/shared/UsersSearchResults";
import { useToast } from "@/components/ui/sonner";
import { useDebounce } from "@/Hooks/useDebounce";
import { useGetUsers, useSearchUsers } from "@/lib/react-query/queriesAndMutatuins";
import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { ClipLoader } from "react-spinners";



const People = () => {
  const [searchValue, setSearchValue] = useState('')
  const { ref, inView } = useInView()
  const debouncedSearch = useDebounce(searchValue, 500)
  const { toast } = useToast()
  const { data: searchedUsers, isFetching: isSearchFetching } = useSearchUsers(debouncedSearch)
  const { data: users, isLoading, isError: isErrorUsers } = useGetUsers()
  const searchValueRef = useRef<HTMLInputElement>(null)

  const handleSearchIconClick = () => {
    searchValueRef.current?.focus()
  }
  

  if (isErrorUsers) {
    toast({ title: "Something went wrong." })
    
    return
  }

  const showSearchResults = searchValue !== ""
  //const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((items) => items?.documents.length === 0)

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
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">People</h2>
        {isLoading && !users ? (
          <ClipLoader />
        ) : showSearchResults ? (
          <UsersSearchResults
            isSearchFetching={isSearchFetching}
            searchedUsers={searchedUsers ?? { documents: [] }}
          />
        ) : (
          <ul className="user-grid">
            {users?.documents.map((user) => (
              <li key={user?.$id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={user} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}


export default People