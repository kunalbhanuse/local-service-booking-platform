import { email, z } from "zod";

export const validateSignUp = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export const validateLogin = z.object({
  email: z.email(),
  password: z.string(),
});

export const validateForgetPassword = z.object({
  email: z.email(),
});
