import UpdateProfileForm from '@/components/forms/UpdateProfileForm'
import { useGetUserById } from '@/lib/react-query/queriesAndMutatuins'
import type { IUpdateProfile } from '@/types'
import { useParams } from 'react-router-dom'
import { ClipLoader } from 'react-spinners'

const EditProfile = () => {

  const { id } = useParams()
  const {data: currentUser, isPending } = useGetUserById(id || '')

  if(isPending || !currentUser){
         return (
            <div className="flex-center w-full h-full">
                <ClipLoader />
            </div>
        )}
         return <UpdateProfileForm profile={currentUser as unknown as IUpdateProfile} />
}

export default EditProfile