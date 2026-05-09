import z from "zod";

export const SearchSchema = z.object({
  search: z.string().min(5, "Prompt must be at least 5 characters long"),
});
