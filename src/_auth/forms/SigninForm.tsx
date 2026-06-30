import * as z from "zod"
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  {  signinValidation } from "@/lib/validation"
import { useToast } from "@/components/ui/sonner"
import {useSigninAccount } from "@/lib/react-query/queriesAndMutatuins"
import { ClipLoader } from "react-spinners";
import { useUserContext } from "@/context/UseUserContext"



const SigninForm = () => {
  const { toast } = useToast()
  const { checkAuthUser } = useUserContext()
  const navigate = useNavigate()

  const { mutateAsync: signinAccount, isPending: isSigningInUser } = useSigninAccount()


  const form = useForm<z.infer<typeof signinValidation>>({
    resolver: zodResolver(signinValidation),
    defaultValues: {
      email: "",
      password: "",
    }
  })

  async function onSubmit(Values: z.infer<typeof signinValidation>) {
      localStorage.removeItem('cookieFallback')

    try {
      
      const session = await signinAccount({email: Values.email, password: Values.password})
      if(!session) {
        toast({ title: 'Sign in failed. please try again.' })

        return
      }
      await new Promise(resolve => setTimeout(resolve, 100));

      
      const isLoggedIn = await checkAuthUser()
      if(isLoggedIn) {
        form.reset()
        navigate('/')
      } else {
         toast({title: 'sign in failed. please try again.'})

         return
      }

    } catch {
      toast({title: 'Sign in failed. please try again.'})
    }
  }

 
 
 
  return (


      
  <>
        <form className="flex flex-col w-40 rounded-md bg-dark-4 p-3" onSubmit={form.handleSubmit(onSubmit)} >
          <header>
            <h1 className="text-[0.6rem] font-bold text-light-2  px-1" >Login to your account</h1>
            
          </header>

          
            
            
            
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
            

           
            <button className="text-small-regular text-light-2 text-center w-full bg-purple-500 mt-3  px-2 rounded-sm" type="submit">
              { isSigningInUser ?
            (
              <div className="flex-center gap-2"><ClipLoader /> Loading ...</div>
            ):"Sign in"}</button>
            
            
        </form>     
      
        <p className="text-[0.4rem] mt-1 text-light-2 text-center">
      Don't have an account?
          <Link to="/sign-up" className="text-primary-500 text-[0.5rem] ml-1" >
     Sign up
          </Link>
        </p>
  </>
  )


}

export default SigninForm