import * as z from "zod"
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  { signupValidation } from "@/lib/validation"
import { useToast } from "@/components/ui/sonner"
import { useCreateUserAccount, useSaveUserToDB, useSigninAccount } from "@/lib/react-query/queriesAndMutatuins"
import { ClipLoader } from "react-spinners";
import { useUserContext } from "@/context/UseUserContext"
import { avatars } from "@/lib/appwrite/config"



const SignupForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount()
  const { mutateAsync: signinAccount, isPending: isSigningInUser } = useSigninAccount()
  const { mutateAsync: saveUserToDB } = useSaveUserToDB() 

  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      email: "",
    },
  })

  async function onSubmit(Values: z.infer<typeof signupValidation>) {
      localStorage.removeItem('cookieFallback')

    try {
      const newAccount = await createUserAccount(Values)
      if(!newAccount) {
        return toast({ title: 'Account creation failed. please try again.' })
      }
      
      const session = await signinAccount({email: Values.email, password: Values.password})
      if(!session) {
        return toast({ title: 'Sign in failed. please try again.' })
      }
      await new Promise(resolve => setTimeout(resolve, 100));

      
      const newUser = await saveUserToDB({
        accountId: newAccount.$id,
        name: newAccount.name,
        email: newAccount.email,
        username: Values.username,
        imageUrl: avatars.getInitials(Values.name).toString()
      })

      if(!newUser) {
        return toast({ title: 'Could not save profile. please try again.' })
      }

      /** */

      const isLoggedIn = await checkAuthUser()
      if(isLoggedIn) {
        form.reset()
        navigate('/')
      } else {
        return toast({title: 'sign up failed. please try again.'})
      }

    } catch {
      toast({title: 'Signup failed. please try again.'})
    }
  }

  return (
 
  <>
        <form className="flex flex-col w-60   rounded-md bg-dark-4 p-3" onSubmit={form.handleSubmit(onSubmit)} >
          <header>
            <h1 className="text-[1rem] font-bold text-light-2  px-2" >Create a new account</h1>
            <h3 className="text-[0.6rem] text-light-2 px-2">
          Update your profile information below.
            </h3>
          </header>

          
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="field " data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-name" className="form-label">
                    Name
                  </label>
                  <input
                  type="text"
                  className="form-input"
                    {...field}
                    id="form-rhf-input-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name here."
                    autoComplete="name"
                  />
                  
                  {fieldState.invalid && fieldState.error && (
                    <span className="form-error">{fieldState.error.message}</span>
                    )}
                </div>
                  )}
                 />
            
            
            
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="field" data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-username" className="form-label">
                    Username
                  </label>
                  <input
                  type="text"
                  className="form-input"
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your username here."
                    autoComplete="username"
                  />
                  
                  {fieldState.invalid && fieldState.error && (
                    <span className="form-error">{fieldState.error.message}</span>
                    )}
                </div>
                  )}
                 />  
           

            
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="field" data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-password" className="form-label">
                    Password
                  </label>
                  <input
                  type="password"
                  className="form-input"
                    {...field}
                    id="form-rhf-input-password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter password here."
                    
                  />
                  
                  {fieldState.invalid && fieldState.error && (
                    <span className="form-error">{fieldState.error.message}</span>
                    )}
                </div>
                  )}
                 />  
            

            
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="field" data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-email" className="form-label">
                    E-mail
                  </label>
                  <input
                  type="email"
                  className="form-input"
                    {...field}
                    id="form-rhf-input-email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your E-mail here."
                    autoComplete="email"
                  />
                  
                  {fieldState.invalid && fieldState.error && (
                    <span className="form-error">{fieldState.error.message}</span>
                    )}
                </div>
                  )}
                 />  
            
            <button className="form-bottom" type="submit">
              {isCreatingAccount || isSigningInUser ?
            (
              <div className="flex-center gap-2">
                <div className="h-14">
                  <ClipLoader />
                </div>
                 <p>Loading ...</p>
              </div>
            ):"Sign up"}</button>
            
            
        </form>     
      
        <p className="text-[0.6rem] mt-2 text-light-2 text-center">
      Already have an account?
          <Link to="/sign-in" className="text-primary-500 text-[0.7rem] ml-2" >
     Log in
          </Link>
        </p>
  </>
           
     
     
     
  
    
    

  )


}

export default SignupForm