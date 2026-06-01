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
 
  function onSubmit(data: z.infer<typeof signupValidation>) {
    // Do something with the form values.
    console.log(data)
  }
 
  return (
    

    <Card className="w-full sm:max-w-md">


      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>
          Update your profile information below.
        </CardDescription>
      </CardHeader>


      <CardContent>
        <form  id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (

                <Field data-invalid={fieldState.invalid}>

                  <FieldLabel htmlFor="form-rhf-input-username">
                    Username
                  </FieldLabel>

                  <Input
                    {...field}
                    id="form-rhf-input-username"
                    aria-invalid={fieldState.invalid}
                    placeholder="shadcn"
                    autoComplete="username"
                  />

                  <FieldDescription >
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


      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-input">
            Save
          </Button>
        </Field>
      </CardFooter>


    </Card>
  )


}

export default SignupForm