import { ClipLoader } from 'react-spinners'
import GridPostList from './GridPostList'
import type { IPost } from '@/types'

type PostsSearchResultsProps = {
  isSearchFetching: boolean
  searchedPosts: { documents: IPost[] }
}

const PostsSearchResults = ({ isSearchFetching, searchedPosts }:PostsSearchResultsProps) => {
  if (isSearchFetching) {
    return <ClipLoader />
  } else if (searchedPosts?.documents.length > 0) {
    return <GridPostList posts={searchedPosts.documents} />
  } else {
    return <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  }
}

export default PostsSearchResults
