import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import  {Field, FieldDescription,FieldError,FieldGroup,FieldLabel}from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Card,CardHeader,CardFooter,CardTitle,CardDescription,CardContent} from "@/components/ui/card"
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

<Card  className="bg-dark-4 my-auto">
      <CardHeader>
        <CardTitle className="text-2[0.8rem] text-light-2" >Profile Settings</CardTitle>
        <CardDescription className="text-[0.4rem] text-light-2">
          Update your profile information below.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form >
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-input-username" className="text-[0.8rem] text-light-2">
                    Username
                  </FieldLabel>
                  <Input
                  className="h-5 text-[0.6rem] rounded-{5px}"
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="shadcn"
                    autoComplete="username"
                  />
                  <FieldDescription className="text-[0.4rem] text-light-2">
                    This is your public display name. Must be between 3 and 10
                    characters. Must only contain letters, numbers, and
                    underscores.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="">
        <Field orientation="horizontal">
          <Button className="py-0" type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-input" className="bg-dark-4">
            Save
          </Button>
        </Field>
      </CardFooter>
    </Card>
  )


}

export default SignupForm