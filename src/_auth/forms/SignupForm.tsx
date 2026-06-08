import * as z from "zod"
import { Link } from 'react-router-dom'
//import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
//import  {Field, FieldDescription,FieldError,FieldGroup,FieldLabel}from "@/components/ui/field"
//import {Input} from "@/components/ui/input"
//import {Card,CardHeader,CardFooter,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
import  { signupValidation } from "@/lib/validation"
import { createUserAccount } from "@/lib/appwrite/api"




const SignupForm = () => {
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })

  async function onSubmit(Values: z.infer<typeof signupValidation>) {

     try {
    const newUser = await createUserAccount(Values)
    console.log(newUser)
  } catch (error) {
    console.error(error)
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
            <button className="text-small-regular text-light-2 text-center w-full bg-purple-500 mt-3  px-2 rounded-sm" type="submit">Sign up</button>  
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