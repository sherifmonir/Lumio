import GridPostList from "@/components/shared/GridPostList"
import SearchResults from "@/components/shared/SearchResults"
import { useDebounce } from "@/Hooks/useDebounce"
import { useGetPosts, useSearchPosts } from "@/lib/react-query/queriesAndMutatuins"
import { useEffect, useRef, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useInView } from "react-intersection-observer"


const Explore = () => {
  const [searchValue, setSearchValue] = useState('')
  const { ref, inView } = useInView()
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch)
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()
  const searchValueRef = useRef<HTMLInputElement>(null)

  const handleSearchIconClick = () => {
    searchValueRef.current?.focus()
  }

  useEffect(() => {
    if (inView && !searchValue) {
      fetchNextPage();
    }
  }, [inView, searchValue,fetchNextPage]);

  if(!posts) {
    return (
      <div className="flex-center w-full h-full">
        <ClipLoader />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== ""
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((items) => items?.documents.length === 0)

  return (
    <div className="explore-container">

      <div className="explore-inner-container">
        <h2 className="h3-bold md:h2-bold w-full">
          Search Posts
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

        <h3 className="body-bold md:h3-bold w-full max-w-5xl mt-16 mb-7">
          Popular Today
        </h3>

       <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResults ? (

          <SearchResults
            isSearchFetching={isSearchFetching}
            searchedPosts={searchedPosts ?? { documents: [] }}
          />

        ) : shouldShowPosts ? (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item?.documents ?? []} />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <ClipLoader />
        </div>
      )}
    </div>
  
)}

export default Explore