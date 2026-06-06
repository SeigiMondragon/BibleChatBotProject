import z from "zod";

export const RegisterResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});
