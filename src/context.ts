import { PrismaClient } from "@prisma/client";
import { decodeAuthHeader, AuthTokenPayload } from "./utils/auth";
import { Request } from "express";

export const prisma = new PrismaClient();

// First you have defined the Context interface
// Right now it’s just an instance of PrismaClient
export interface Context {
  prisma: PrismaClient;
  // The context interface is updated to have a userId type.
  // This is optional because no userId will be attached to the context when requests are sent without the Authorization header.
  userId?: number;
}

export const context = ({ req }: { req: Request }): Context => {
  // 2
  const token =
    req && req.headers.authorization
      ? decodeAuthHeader(req.headers.authorization)
      : null;

  return {
    prisma,
    userId: token?.userId,
  };
};
