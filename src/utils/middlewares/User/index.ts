import { NextFunction } from "express";

import { Req, Res } from "@/utils/types";

export async function UserMiddleware(
  req: Req,
  res: Res,
  next: NextFunction,
): Promise<void> {
  if (req.user) {
    req.user.ip =
      req.headers["cf-connecting-ip"] ||
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.ip;
  }
  next();
}
