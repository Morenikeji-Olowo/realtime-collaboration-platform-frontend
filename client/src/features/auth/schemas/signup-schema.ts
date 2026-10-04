import { z } from "zod"

export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})
export type SignupInput = z.infer<typeof signupSchema>