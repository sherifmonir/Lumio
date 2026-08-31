import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  { profileValidation } from "@/lib/validation"
import FileUploader from "../shared/FileUploader"
import { useUpdateProfile } from "@/lib/react-query/queriesAndMutatuins"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/sonner"
import { ClipLoader } from "react-spinners"
import type { IUserProfile } from "@/types"
import { useState } from "react"

type UpdateProfileFormProps = {
  profile: IUserProfile
}

const UpdateProfileForm = ({profile}: UpdateProfileFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { mutate: updateProfile } = useUpdateProfile()
  const [removePhoto, setRemovePhoto] = useState(false)
  const form = useForm<z.infer<typeof profileValidation>>({
    resolver: zodResolver(profileValidation),
    defaultValues: {
        name: profile.name,
        username: profile.username,
        email: profile.email,
        bio: profile.bio ?? "",
        file:[]      
    }
})


const { isSubmitting } = form.formState;

  

function onSubmit(Values: z.infer<typeof profileValidation>) {
  if (!profile) return

   updateProfile(
    {
      ...Values,
      $id: profile.$id,
      accountId: profile.accountId,
      imageId: profile.imageId,
      imageUrl: profile.imageUrl,
      removePhoto
    },
    {
       onSuccess: () => {
         navigate(`/profile/${profile.$id}`)
      },
      onError: () => {
        toast({ title: `Something went wrong, Please try again.` })
      },
    }
  )
}

  return (
    <form className="flex-center flex-col bg-dark-4 " 
    onSubmit={form.handleSubmit(onSubmit)}> 

            <Controller
                name="name"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label htmlFor="form-rhf-input-name" className="form-label">
                    Name
                  </label>
                  <input 
                  id="form-rhf-input-name"
                    className="form-input"
                    {...field}
                    placeholder="Add you name here."                    
                  />
                </div>

                  )}
            />


            <Controller
                name="file"
                control={form.control}
                render={({ field }) => (

                <div className="field flex-col" >
                  <label  className="form-label">
                    Photo
                  </label>
                  <FileUploader
                  fieldChange={(files) => {
                  field.onChange(files)
                  if (files.length > 0) setRemovePhoto(false)
                  }}
                  mediaUrl={removePhoto ? "" : profile.imageUrl}
      
                  />
                  {!removePhoto && profile.imageId && (
                    <button type="button" onClick={() => setRemovePhoto(true)} 
                    className="text-light-3 small-medium mt-2 underline cursor-pointer">
                      Remove photo
                    </button>
                  )}
                </div>
                )}
            />
            


            <Controller
                name="username"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label htmlFor="form-rhf-input-username" className="form-label">
                    Username
                  </label>
                  <input 
                    id="form-rhf-input-username"
                    type="text"
                    className="form-input"
                    placeholder="Add you Username here."
                    {...field}
                    />
                    
                </div>

                  )}
            />


            <Controller
                name="bio"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label htmlFor="form-rhf-input-bio" className="form-label">
                    Bio
                  </label>
                  <input 
                   id="form-rhf-input-bio"
                   type="text"
                   className="form-input"
                   placeholder="Add you Bio here."
                   {...field}
                   />
                </div>

                  )}
            /> 
                 
                 
        <div className="flex gap-4 items-center justify-end">

            <button
              type="submit"
              className="form-bottom"
              disabled={isSubmitting}>

              {(isSubmitting) && <ClipLoader size={15}/>}
              

              <span> Update </span>

            </button>

            <button 
              className="form-bottom bg-amber-50 text-dark-1"
              type="button"
              onClick={() => navigate(-1)}>

              Cancel

            </button>

        </div>
      </form>     
  )
}

export default UpdateProfileForm