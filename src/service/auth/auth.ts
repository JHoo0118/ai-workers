import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/const/const";
import { deleteTokens } from "@/lib/utils/auth";
import { fetchInterceptors } from "@/lib/utils/fetch";
import { LoginSchema, loginSchema } from "@/lib/validation/loginSchema";
import {
  RefreshTokensSchema,
  refreshTokensSchema,
} from "@/lib/validation/refreshTokensSchema";
import { SignupSchema, signupSchema } from "@/lib/validation/signupSchema";
import {
  GoogleLoginOutputs,
  LoginInputs,
  LoginOutputs,
  RefreshTokensOutputs,
  SignupOutputs,
  signupInputs,
} from "@/types/auth-types";
import { getCookie, hasCookie } from "cookies-next";
import { decodeJwt } from "jose";

export async function signup(
  signupSchemaInputs: SignupSchema,
): Promise<SignupOutputs> {
  const parseResult = signupSchema.safeParse(signupSchemaInputs);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }
  const { email, password, username } = parseResult.data;
  const pData: signupInputs = {
    email,
    password,
    username,
  };

  return fetchInterceptors({
    url: "/py-api/auth/signup",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pData),
    },
  });
}

export async function login(
  loginSchemaInputs: LoginSchema,
): Promise<LoginOutputs> {
  const parseResult = loginSchema.safeParse(loginSchemaInputs);

  if (!parseResult.success) {
    console.error(parseResult.error);
    throw new Error(parseResult.error.toString());
  }

  const { email, password } = parseResult.data;
  const pData: LoginInputs = {
    username: email,
    password,
  };

  return fetchInterceptors({
    url: "/py-api/auth/login",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams(pData),
    },
  });
}

export async function logout(): Promise<LoginOutputs> {
  return fetchInterceptors({
    url: "/py-api/auth/logout",
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    },
    isRequiredAccessToken: true,
  });
}

export async function refreshTokens(): Promise<RefreshTokensOutputs> {
  if (!hasCookie(REFRESH_TOKEN) || !hasCookie(ACCESS_TOKEN)) {
    throw new Error("토큰 재발급 중 오류가 발생했습니다.");
  }

  const accessToken = getCookie(ACCESS_TOKEN)!;
  const email = decodeJwt(accessToken).sub!;

  const refreshTokensSchemaInputs: RefreshTokensSchema = {
    email,
    refreshToken: getCookie(REFRESH_TOKEN)!,
  };

  const parseResult = refreshTokensSchema.safeParse(refreshTokensSchemaInputs);

  if (!parseResult.success) {
    deleteTokens();
    throw new Error(parseResult.error.toString());
  }

  try {
    const response = await fetch("/py-api/auth/refresh-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parseResult.data),
    });

    if (!response.ok) {
      const errorResp = await response.json();
      const errorMessage = errorResp.hasOwnProperty("detail")
        ? typeof errorResp["detail"] === "string"
          ? errorResp["detail"]
          : "오류가 발생했습니다."
        : `HTTP error, status = ${response.status}`;
      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error: any) {
    deleteTokens();
    throw error?.message || "오류가 발생했습니다.";
  }
}

export const googleLogin = async (): Promise<GoogleLoginOutputs> => {
  return fetchInterceptors({
    url: "/py-api/auth/login/google",
    options: {
      method: "GET",
    },
  });
};
