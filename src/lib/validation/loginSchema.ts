import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
  password: z
    .string()
    .min(8, { message: "비밀번호는 최소 8자 이상으로 입력해 주세요." }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
