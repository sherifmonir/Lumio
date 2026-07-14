import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  {  postValidation } from "@/lib/validation"
import FileUploader from "../shared/FileUploader"
import type { IPost } from "@/types"
import { useCreatePost } from "@/lib/react-query/queriesAndMutatuins"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/sonner"
import { useUserContext } from "@/context/UseUserContext"
import { ClipLoader } from "react-spinners"
import { updatePost } from "@/lib/appwrite/api"


type PostFormProps = {
    post?: IPost
    action: "create" | "update"
}


const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUserContext();

  const form = useForm<z.infer<typeof postValidation>>({
    resolver: zodResolver(postValidation),
    defaultValues: {
      caption: post?.caption ?? "",
      file: [],
      location: post?.location ?? "",
      tags: post?.tags?.join(",") ?? ""
    }
})


const { mutateAsync: createPost } = useCreatePost();
const { isSubmitting } = form.formState;
  

async function onSubmit(Values: z.infer<typeof postValidation>) {
  
  if(post && action ==='update'){
    const updatedPost = await updatePost({
      ...Values,
      postId: post?.$id,
      imageId: post?.imageId,
      imageUrl: post?.imageUrl
    })
    console.log(updatedPost)
    /**When I go back to undo the edit */

    if(!updatedPost) {
      toast({
        title: `Please try again.`
      })
    }

    return navigate(`/posts/${post.$id}`)
}


  const newPost = await createPost({
    ...Values,
    userId: user.id
  })

  if(!newPost) {
    toast({
      title: `${action} post failed. Please try again.`
    })
  }

  navigate("/")
}

  return (
    <form className="flex flex-col gap-9 w-full max-w-5xl bg-dark-4 px-1 mb-2" 
    onSubmit={form.handleSubmit(onSubmit)}> 

            <Controller
                name="caption"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label  className="form-label">
                    Caption
                  </label>
                  <textarea 
                    className="Create-Post-textarea"
                    {...field}
                    placeholder="Add you post here."                    
                  />
                </div>

                  )}
            />


            <Controller
                name="file"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label  className="form-label">
                    Photo
                  </label>
                  <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl ?? ""}
                  />
                </div>

                  )}
            />


            <Controller
                name="location"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label className="form-label">
                    Location
                  </label>
                  <input type="text" className="form-input" {...field}/>
                </div>

                  )}
            />


            <Controller
                name="tags"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label htmlFor="form-rhf-input-email" className="form-label">
                    Tags
                  </label>
                  <input 
                   type="text"
                   className="form-input"
                   placeholder="Art, Expression, Learn"
                   {...field}
                   />
                </div>

                  )}
            /> 
                 
                 
        <div className="flex gap-4 items-center justify-end">

            <button
              type="submit"
              className="form-bottom"
              disabled={isSubmitting }>

              {(isSubmitting) && <ClipLoader size={20}/>}
              {action}

              <span> Post</span>

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

export default PostForm

