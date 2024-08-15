import { z } from "zod";

export const regiserFormSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Fullname must be at lest 2 characters" }),
  username: z
    .string()
    .min(2, { message: "Username must be at lest 2 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Password must be at lest 6 characters" }),
});

export const loginFormSchema = z.object({
  username: z.string().min(1, { message: "Username cannot be empty" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

export const updateProfieSchema = z.object({
  fullname: z.string(),
  username: z.string(),
  email: z.string(),
  bio: z.string(),
  link: z.string(),
  newPassword: z.string(),
  password: z.string(),
});
