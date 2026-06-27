import * as z from "zod"
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  { signupValidation } from "@/lib/validation"
import { useToast } from "@/components/ui/sonner"
import { useCreateUserAccount, useSaveUserToDB, useSigninAccount } from "@/lib/react-query/queriesAndMutatuins"
import { ClipLoader } from "react-spinners";
import { useUserContext } from "@/context/AuthContect"
import {  account, avatars } from "@/lib/appwrite/config"



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
      console.log('[Signup] Account created:', newAccount.$id);
      /** */

      const session = await signinAccount({email: Values.email, password: Values.password})
      if(!session) {
        return toast({ title: 'Sign in failed. please try again.' })
      }
      console.log('[Signup] Session created:', session.$id);
      await new Promise(resolve => setTimeout(resolve, 100));

    const sessionCheck = localStorage.getItem('cookieFallback');
    console.log('[Signup] Session in localStorage:', sessionCheck);
    
    if (!sessionCheck || sessionCheck === '[]') {
      console.warn('[Signup] WARNING: Session not found in localStorage. Waiting...');
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    /** */

    console.log('[Signup] Attempting to save user to DB...');
    
const currentAccount = await account.get();
console.log("currentAccount", currentAccount);
      
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
      console.log('[Signup] User saved to DB:', newUser.$id);

      /** */

      const isLoggedIn = await checkAuthUser()
      if(isLoggedIn) {
        console.log('[Signup] Auth verified, redirecting...');
        form.reset()
        navigate('/')
      } else {
        return toast({title: 'sign up failed. please try again.'})
      }

    } catch(error: unknown) {
      console.error('[Signup] Full error:', error);
      toast({title: 'Signup failed. please try again.'})
    }
  }

 
 
 
  return (
<>
<section  className="bg-dark-3 h-[70%] m-auto place-self-center">
      
      
        <form className="flex flex-col justify-between h-60 w-40  rounded-md bg-dark-4 p-3" onSubmit={form.handleSubmit(onSubmit)} >
          <header>
            <h1 className="text-[0.4rem] font-bold text-light-2 inline-block px-1" >Create a new account</h1>
            <h3 className="text-[0.3rem] text-light-2 px-1">
          Update your profile information below.
            </h3>
          </header>

          <div >
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
            </div>
            
            <div >
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
            </div>

            <div >
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
            </div>

            <div >
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
            </div>
            <button className="text-small-regular text-light-2 text-center w-full bg-purple-500 mt-3  px-2 rounded-sm" type="submit">
              {isCreatingAccount || isSigningInUser ?
            (
              <div className="flex-center gap-2"><ClipLoader /> Loading ...</div>
            ):"Sign up"}</button>  
        </form>     
      
      
        <p className="text-[0.4rem] mt-3 text-light-2 text-center">
      Already have an account?
          <Link to="/sign-in" className="text-primary-500 text-[0.5rem] ml-1" >
     Log in
          </Link>
        </p>
           
     
     
     
  
    </section>
    
</>
  )


}

export default SignupForm