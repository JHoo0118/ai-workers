// utils/setSecureCookie.ts

import { serialize } from "cookie";
import { ServerResponse } from "http";

interface SetSecureCookieOptions {
  name: string;
  value: string;
  reqSecure: boolean;
  maxAge?: number; // Max age in seconds
  path?: string;
  domain?: string;
  sameSite?: "lax" | "strict" | "none";
}

export const setSecureCookie = (
  res: ServerResponse,
  options: SetSecureCookieOptions,
) => {
  const {
    name,
    value,
    reqSecure,
    maxAge = 60 * 30, // 30 mins
    path = "/",
    domain,
    sameSite = "strict",
  } = options;

  const cookieOptions = {
    httpOnly: true,
    secure: reqSecure,
    maxAge,
    path,
    sameSite,
    ...(domain && { domain }),
  };

  const serializedCookie = serialize(name, value, cookieOptions);

  res.setHeader("Set-Cookie", serializedCookie);
};
