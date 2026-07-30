import { ClipLoader } from 'react-spinners'
import type { IUser } from '@/types'
import UserCard from './UserCard'

type UsersSearchResultsProps = {
  isSearchFetching: boolean
  searchedUsers: { documents: IUser[] }
}

const UsersSearchResults = ({ isSearchFetching, searchedUsers }:UsersSearchResultsProps) => {
  if (isSearchFetching) {
    return <ClipLoader />
  } else if (searchedUsers?.documents.length > 0) {
    return (
      <>
        {searchedUsers.documents.map((user) => (
          <UserCard key={user.accountId} user={user} />
        ))}
      </>
    )
  } else {
    return <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  }
}

export default UsersSearchResults