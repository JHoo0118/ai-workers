// import { getCookie } from "cookies-next";
// import jwt from "jsonwebtoken";
// import { cookies } from "next/headers";
// import type { NextRequest } from "next/server";
// import { NextResponse } from "next/server";
// import { ACCESS_TOKEN, REFRESH_TOKEN } from "./const/const";
// import { deleteTokens } from "./lib/utils/auth";
// import { RefreshTokensSchema } from "./lib/validation/refreshTokensSchema";

// export async function middleware(req: NextRequest) {
//   const { pathname, search, origin, basePath } = req.nextUrl;
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

//   if (
//     accessToken &&
//     (pathname.startsWith("/login") || pathname.startsWith("/signup"))
//   ) {
//     return NextResponse.redirect(new URL(`${basePath}`, origin));
//   }

//   if (req.nextUrl.pathname.startsWith("/ai")) {
//     const urlWithForward = req.nextUrl.clone();
//     urlWithForward.pathname = "/login"; // Your login route
//     urlWithForward.searchParams.set("forwardUrl", req.nextUrl.pathname);

//     const loginUrl = new URL(`${basePath}/login`, origin);
//     if (!accessToken) {
//       deleteTokens();
//       return NextResponse.redirect(urlWithForward);
//     }
//     try {
//       const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY!;
//       jwt.verify(accessToken, accessTokenKey);
//       return NextResponse.next();
//     } catch (error) {
//       try {
//         const accessToken = getCookie(ACCESS_TOKEN)!;
//         const email = jwt.decode(accessToken)!.sub!.toString();
//         const refreshTokensSchemaInputs: RefreshTokensSchema = {
//           email,
//           refreshToken: getCookie(REFRESH_TOKEN)!,
//         };

//         await fetch("/py-api/auth/refresh-tokens", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(refreshTokensSchemaInputs),
//         });
//         return NextResponse.next();
//       } catch (error) {}
//       deleteTokens();
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./const/const";
import { deleteTokens } from "./lib/utils/auth";

async function verifyAccessToken(accessToken: string): Promise<boolean> {
  const accessTokenKey = process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY;
  if (!accessTokenKey) {
    console.error("Access token key is not defined in environment variables.");
    return false;
  }

  try {
    await jwtVerify(accessToken, new TextEncoder().encode(accessTokenKey), {
      algorithms: ["HS256"],
    });
    return true;
  } catch (error) {
    console.error("토큰 인증 실패:", error);
    return false;
  }
}

async function refreshTokens(
  email: string,
  refreshToken: string,
): Promise<boolean> {
  try {
    const response = await fetch("/py-api/auth/refresh-tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, refreshToken }),
    });

    return response.ok;
  } catch (error) {
    console.error("토큰 갱신 실패:", error);
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname, origin, basePath } = req.nextUrl;
  const cookieStore = req.cookies;
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;

  console.log(pathname);
  if (
    accessToken &&
    (pathname.startsWith("/login") || pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL(basePath, origin));
  }

  const loginUrl = new URL(`${basePath}/login`, origin);
  // Protected paths requiring authentication
  if (pathname.startsWith("/ai")) {
    if (!accessToken) {
      deleteTokens();
      const forwardUrl = req.nextUrl.clone();
      forwardUrl.pathname = "/login";
      forwardUrl.searchParams.set("forwardUrl", req.nextUrl.pathname);

      return NextResponse.redirect(forwardUrl);
    }

    // const isAccessTokenValid = await verifyAccessToken(accessToken);
    // if (!isAccessTokenValid) {
    //   const email = jwt.decode(accessToken)?.sub?.toString();
    //   const refreshToken = cookieStore.get(REFRESH_TOKEN)?.value;
    //   if (
    //     !email ||
    //     !refreshToken ||
    //     !(await refreshTokens(email, refreshToken))
    //   ) {
    //     console.log(3);
    //     deleteTokens();
    //     return NextResponse.redirect(loginUrl);
    //   }
    // }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc|py-api)(.*)"],
};
