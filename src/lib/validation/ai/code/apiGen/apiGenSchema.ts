import { z } from "zod";

export const apiGenSchema = z.object({
  input: z.string().min(1, { message: "설명을 적어주세요." }),
  framework: z.string(),
});

export type ApiGenSchema = z.infer<typeof apiGenSchema>;
