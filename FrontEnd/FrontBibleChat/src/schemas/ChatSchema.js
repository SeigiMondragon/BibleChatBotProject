import { z } from "zod";

export const chatSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters long"),
});
