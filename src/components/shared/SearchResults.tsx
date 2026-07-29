import { ClipLoader } from 'react-spinners'
import GridPostList from './GridPostList'
import type { IPost } from '@/types'

type SearchResultsProps = {
  isSearchFetching: boolean
  searchedPosts: { documents: IPost[] }
}

const SearchResults = ({ isSearchFetching, searchedPosts }:SearchResultsProps) => {
  if (isSearchFetching) {
    return <ClipLoader />
  } else if (searchedPosts?.documents.length > 0) {
    return <GridUsersList posts={searchedPosts.documents} />
  } else if (searchedUsers?.documents.length > 0) {
    return <GridPostList posts={searchedUsers.documents} />
  } else {
    return <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  }
}

export default SearchResults