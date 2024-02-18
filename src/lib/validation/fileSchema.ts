import { z } from "zod";

export const fileDonwloadInputsSchema = z.object({
  filename: z.string(),
});

export type FileDonwloadInputsSchema = z.infer<typeof fileDonwloadInputsSchema>;
