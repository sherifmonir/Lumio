import * as z from "zod"

export const signupValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 10 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    ),
    email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters.").max(100, "Password must be at most 100 characters."),
})

export const signinValidation = z.object({
  email: z.string().email("Invalid email address."),
    password: z.string().min(8, "Password must be at least 8 characters.").max(100, "Password must be at most 100 characters.")
})

export const postValidation = z.object({
  caption: z.string().min(1).max(2000),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string()
})