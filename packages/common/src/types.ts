import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    name: z.string().min(2, "Name must be at least 2 characters")
})


export const SigninSchema = z.object({
    username: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required")
})


export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})