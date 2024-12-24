import { CookieOptions, Response } from "express";

type CookiePayloadType = {
  res: Response;
  accessToken?: string;
  refreshToken?: string;
  options: "accessToken" | "refreshToken" | "both";
};
export const REFRESH_PATH = `${process.env.BASE_PATH}/auth/refresh`;

export const setAuthenticationCookie = ({
  accessToken,
  refreshToken,
  res,
  options,
}: CookiePayloadType): Response => {
  if (options === "accessToken") {
    return res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      expires: new Date(Date.now() + 15 * 60 * 1000),
      path: "/",
    });
  } else if (options === "refreshToken") {
    return res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" ? true : false,
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      path: "/",
    });
  } else {
    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        expires: new Date(Date.now() + 15 * 60 * 1000),
        path: "/",
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        path: "/",
      });
  }
};
