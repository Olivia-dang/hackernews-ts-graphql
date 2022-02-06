import * as jwt from "jsonwebtoken";

export const APP_SECRET: string = process.env.APP_SECRET ?? "";

export interface AuthTokenPayload {
  userId: number;
}

// The decodeAuthHeader function takes the Authorization header and parses it to return the payload of the JWT.
export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  // 2
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("No token found");
  }
  // The jwt.verify() functions decodes the token
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload;
}
