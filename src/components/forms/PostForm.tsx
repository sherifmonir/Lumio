import * as z from "zod"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  {  postValidation } from "@/lib/validation"
import FileUploader from "../shared/FileUploader"
import type { IPost } from "@/types"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queriesAndMutatuins"
import { useNavigate } from "react-router-dom"
import { useToast } from "../ui/Toast"
import { useUserContext } from "@/context/UseUserContext"
import { ClipLoader } from "react-spinners"
import type { ControllerRenderProps } from "react-hook-form"
import { useMentionAutocomplete } from "@/Hooks/useMentionAutocomplete"
import MentionSuggestions from "../shared/mentions/MentionSuggestions"


type PostFormProps = {
    post?: IPost
    action: "Create" | "Update"
}

type CaptionFieldProps = {
  field: ControllerRenderProps<z.infer<typeof postValidation>, "caption">
}

const CaptionField = ({ field }: CaptionFieldProps) => {
  const mention = useMentionAutocomplete(field.value, field.onChange)

  return (
    <div className="field relative">
      <label htmlFor="form-rhf-input-caption" className="form-label">
        Caption
      </label>
      <textarea
        id="form-rhf-input-caption"
        className="Create-Post-textarea"
        {...field}
        ref={(el) => {
          field.ref(el)
          mention.setInputRef(el)
        }}
        onSelect={mention.trackCursor}
        onKeyUp={mention.trackCursor}
        placeholder="Add you post here."
      />
      {mention.activeMention && (
        <MentionSuggestions suggestions={mention.suggestions} onSelect={mention.selectMention} />
      )}
    </div>
  )
}


const PostForm = ({ post, action }: PostFormProps) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useUserContext()
  const { mutateAsync: updatePost } = useUpdatePost();


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
  
  if(post && action ==='Update'){
    const updatedPost = await updatePost({
      ...Values,
      postId: post?.$id,
      imageId: post?.imageId,
      imageUrl: post?.imageUrl
    })
    
    if(!updatedPost) {
      toast({
        title: `${action} post failed. Please try again.`
      })
    }

    return navigate(`/post/${post.$id}`)
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
    <form className="flex flex-col  gap-5 w-full max-w-5xl bg-dark-4 px-1 mb-5" 
    onSubmit={form.handleSubmit(onSubmit)}> 

            <Controller
                name="caption"
                control={form.control}
                render={({ field }) => <CaptionField field={field} />}
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
                  <label htmlFor="form-rhf-input-location" className="form-label">
                    Location
                  </label>
                  <input id="form-rhf-input-location" type="text" className="form-input" {...field}/>
                </div>

                  )}
            />


            <Controller
                name="tags"
                control={form.control}
                render={({ field }) => (

                <div className="field" >
                  <label htmlFor="form-rhf-input-tags" className="form-label">
                    Tags
                  </label>
                  <input 
                   id="form-rhf-input-tags"
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
              disabled={isSubmitting}>

              {(isSubmitting) && <ClipLoader size={15}/>}
              {action}

              <span className="ml-2"> Post </span>

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

