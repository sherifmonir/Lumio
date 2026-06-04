import * as z from "zod"
//import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
//import  {Field, FieldDescription,FieldError,FieldGroup,FieldLabel}from "@/components/ui/field"
//import {Input} from "@/components/ui/input"
//import {Card,CardHeader,CardFooter,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
import  { signupValidation } from "@/lib/validation"




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
 
 
 
  return (

<section  className="bg-dark-4 flex flex-col rounded-md px-3 h-50 w-35">
      <header>
        <h1 className="text-[0.4rem] font-bold text-light-2 inline-block px-1" >Create a new account</h1>
        <h3 className="text-[0.3rem] text-light-2 px-1">
          Update your profile information below.
        </h3>
      </header>
      
        <form className="flex flex-col" >

          <div >
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="feild " data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-username" className="form-label">
                    Name
                  </label>
                  <input
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
                <div className="feild" data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-username" className="form-label">
                    Username
                  </label>
                  <input
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
                <div className="feild" data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-username" className="form-label">
                    Password
                  </label>
                  <input
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
                <div className="feild" data-invalid={fieldState.invalid}>
                  <label htmlFor="form-rhf-input-username" className="form-label">
                    E-mail
                  </label>
                  <input
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
        </form>     
      
      <footer className="flex-center">
        <div className="flex-center pt-4 gap-3">
          <button className="bg-light-2 h-4 w-10 rounded-[5px] text-[0.6rem] font-bold bord"  type="button" onClick={() => form.reset()}>
            Reset
          </button>
          <button className="bg-light-2 h-4 w-10 rounded-[5px] text-[0.6rem] font-bold bord" type="submit" form="form-rhf-input" >
            Save
          </button>
        </div>
      </footer>
    </section>
  )


}

export default SignupForm