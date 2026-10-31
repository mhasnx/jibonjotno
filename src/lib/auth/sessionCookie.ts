const isProduction = process.env.NODE_ENV === "production";

/** HttpOnly + Secure (prod) + SameSite=Strict session cookie flags. */
export const SESSION_COOKIE_NAME = "jj_session_token";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true as const,
  secure: isProduction,
  sameSite: "strict" as const,
  path: "/",
};
