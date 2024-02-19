import { z } from "zod";

export const codeConvertSchema = z.object({
  code: z.string(),
  codeType: z.string(),
  targetCodeType: z.string(),
});

export type CodeConvertSchema = z.infer<typeof codeConvertSchema>;
