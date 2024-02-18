import { z } from "zod";

export const refreshTokensSchema = z.object({
  email: z.string().email({ message: "유효한 이메일 주소가 아닙니다." }),
  refreshToken: z.string(),
});

export type RefreshTokensSchema = z.infer<typeof refreshTokensSchema>;
