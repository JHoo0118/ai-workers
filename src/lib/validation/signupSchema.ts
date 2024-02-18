import { z } from "zod";

export const signupSchema = z
  .object({
    email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
    username: z
      .string()
      .min(2, { message: "사용자명은 최소 2자 이상으로 입력해 주세요." }),
    password: z
      .string()
      .min(8, { message: "비밀번호는 최소 8자 이상으로 입력해 주세요." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });

export type SignupSchema = z.infer<typeof signupSchema>;
