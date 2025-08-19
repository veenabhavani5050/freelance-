// --- api/utils/generateToken.js ---
// I've kept this file exactly as you provided it.
import jwt from "jsonwebtoken";

const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "jwt";
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

export const signAuthToken = (userId) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// Convenience: sign token, set cookie and return token
const createSendToken = (res, user) => {
  const token = signAuthToken(user._id.toString());
  setAuthCookie(res, token);
  return token;
};

export default createSendToken;
