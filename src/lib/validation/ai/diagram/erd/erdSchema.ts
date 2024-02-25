import { z } from "zod";

export const erdSchema = z.object({
  query: z
    .string()
    .min(1, { message: "DDL 또는 DML 문을 입력해 주세요." })
    .regex(
      new RegExp(
        /(CREATE|ALTER|DROP|TRUNCATE|INSERT|UPDATE|DELETE|SELECT)\s/,
        "gi",
      ),
      "올바른 형태로 입력해 주세요.",
    ),
});

export type ErdSchema = z.infer<typeof erdSchema>;
