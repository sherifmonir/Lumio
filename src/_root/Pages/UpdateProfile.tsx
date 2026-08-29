import UpdateProfileForm from '@/components/forms/UpdateProfileForm'
import { useGetUserById } from '@/lib/react-query/queriesAndMutatuins'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

const UpdateProfile = () => {

  const { id } = useParams()
  const {data: currentUser, isPending } = useGetUserById(id || '')

  if(isPending){
         return (
            <div className="flex-center w-full h-full">
                <ClipLoader />
            </div>
        )}
 if(!currentUser){
    return (
        <div className="flex-center w-full h-full">
            <p className="text-light-3">User not found</p>
        </div>
    )
 }
         return <UpdateProfileForm profile={currentUser} />
}

export default UpdateProfile