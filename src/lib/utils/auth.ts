// utils/auth.ts
import { ACCESS_TOKEN, REFRESH_TOKEN, USER } from "@/const/const";
import { refreshTokens } from "@/service/auth/auth";
import { RefreshTokensOutputs } from "@/types/auth-types";
import { deleteCookie, getCookie, hasCookie } from "cookies-next";
import { jwtVerify } from "jose";

export const isAuthenticated = async (ctx?: any): Promise<boolean> => {
  const isExistToken = hasCookie(ACCESS_TOKEN, ctx);

  if (!isExistToken) return false;

  const accessToken = getCookie(ACCESS_TOKEN, ctx)!;
  const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY!;

  try {
    await jwtVerify(accessToken, new TextEncoder().encode(accessTokenKey), {
      algorithms: ["HS256"],
    });
    return true;
  } catch (error) {
    const result: RefreshTokensOutputs = await refreshTokens();
    if (result.hasOwnProperty(REFRESH_TOKEN)) {
      return true;
    }
    return false;
  }
};

export const deleteTokens = () => {
  if (hasCookie(ACCESS_TOKEN)) {
    deleteCookie(ACCESS_TOKEN);
  }
  if (hasCookie(REFRESH_TOKEN)) {
    deleteCookie(REFRESH_TOKEN);
  }
  if (typeof window !== "undefined" && localStorage.getItem(USER)) {
    localStorage.removeItem(USER);
  }
};
