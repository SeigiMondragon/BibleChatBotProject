import z from "zod";

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(5, "Password must be at least 5 characters long"),
});
