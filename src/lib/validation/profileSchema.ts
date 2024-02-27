import { z } from "zod";

export const profileSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
  username: z
    .string()
    .min(2, { message: "사용자명은 최소 2자 이상으로 입력해 주세요." }),
});

export type ProfileSchema = z.infer<typeof profileSchema>;
