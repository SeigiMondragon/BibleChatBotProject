import z from "zod";

export const LoginResponseSchema = z.object({
  success: z.boolean(),
});
