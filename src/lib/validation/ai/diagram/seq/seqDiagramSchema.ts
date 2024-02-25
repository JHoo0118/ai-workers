import { z } from "zod";

export const sequenceDiagramSchema = z.object({
  request: z.string().min(1, { message: "필수로 항목입니다." }),
});

export type SequenceDiagramSchema = z.infer<typeof sequenceDiagramSchema>;
