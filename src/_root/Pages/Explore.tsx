import GridPostList from "@/components/shared/posts/GridPostList"
import PostsSearchResults from "@/components/shared/posts/PostsSearchResults"
import { useDebounce } from "@/Hooks/useDebounce"
import { useGetPosts, useSearchPosts, useGetFollowingRelations } from "@/lib/react-query/queriesAndMutatuins"
import { useEffect, useMemo, useRef, useState } from "react"
import { ClipLoader } from "react-spinners"
import { useInView } from "react-intersection-observer"
import { useUserContext } from "@/context/UseUserContext"


const Explore = () => {
  const [searchValue, setSearchValue] = useState('')
  const { ref, inView } = useInView()
  const debouncedSearch = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } = useSearchPosts(debouncedSearch)
  const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()
  const searchValueRef = useRef<HTMLInputElement>(null)
  const { user } = useUserContext()
  const { data: relations } = useGetFollowingRelations(user.id)
  const followingIds = useMemo(() => relations?.map((r) => r.followingId) ?? [], [relations]);

 const postsMemo = useMemo(() => {
  if (!posts?.pages) return [];
  const followed = new Set(followingIds);
  return posts.pages.map((page) => {
    const docs = page?.documents ?? [];
    const notFollowed: typeof docs = [];
    const followedDocs: typeof docs = [];
    for (const post of docs) (followed.has(post.creator.$id) ? followedDocs : notFollowed).push(post);
    return { documents: [...notFollowed, ...followedDocs] }; 
  });
}, [posts, followingIds])


  const handleSearchIconClick = () => {
    searchValueRef.current?.focus()
  }

  useEffect(() => {
    if (inView && !searchValue && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, searchValue, fetchNextPage, hasNextPage]);

  if(!posts) {
    return (
      <div className="flex-center w-full h-full">
        <ClipLoader size={15} />
      </div>
    )
  }

  const shouldShowSearchResults = searchValue !== ""
  const shouldShowPosts = !shouldShowSearchResults && posts.pages.every((items) => items?.documents.length === 0)
  return (
    <div className="explore-container overflow-auto scrollbar-none">
  <div className="explore-inner-container">
    <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>

    {/* Search Input Container */}
    <div className="flex items-center gap-3 px-4 w-full rounded-xl bg-muted h-12 border border-border/50">
      <img
        src="/assets/icons/search.svg"
        width={20}
        height={20}
        alt="search"
        className="cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={handleSearchIconClick}
      />
      <input
        ref={searchValueRef}
        type="text"
        placeholder="Search posts or tags..."
        className="w-full bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground text-sm"
        value={searchValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchValue(e.target.value)
        }}
      />
    </div>
  </div>

  {/* Posts Layout (Stacked Vertically for Infinite Scroll) */}
  <div className="flex flex-col gap-9 w-full max-w-5xl mt-8 mb-3">
    {shouldShowSearchResults ? (
      <PostsSearchResults
        isSearchFetching={isSearchFetching}
        searchedPosts={searchedPosts ?? { documents: [] }}
      />
    ) : shouldShowPosts ? (
      <p className="text-muted-foreground mt-10 text-center w-full">End of posts</p>
    ) : (
      postsMemo.map((item, index) => (
        <GridPostList key={`page-${index}`} posts={item?.documents ?? []} />
      ))
    )}
  </div>

  {hasNextPage && !searchValue && (
    <div ref={ref} className="mt-10 flex justify-center">
      <ClipLoader size={15} />
    </div>
  )}
</div> 
)}

export default Explore