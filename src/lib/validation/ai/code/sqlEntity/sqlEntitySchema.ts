import { z } from "zod";

export const sqlToEntitySchema = z.object({
  sql: z.string(),
  framework: z.string(),
});

export type SqlToEntitySchema = z.infer<typeof sqlToEntitySchema>;
