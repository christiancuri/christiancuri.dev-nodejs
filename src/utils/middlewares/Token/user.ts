import { NextFunction } from "express";

import { Req, Res } from "@/utils/types";

import * as TokenUtils from "../../TokenUtils";

export async function UserTokenMiddleware(
  req: Req,
  res: Res,
  next: NextFunction,
): Promise<Res | void> {
  const { url } = req;

  if (
    req.method === "OPTIONS" ||
    (url && !(await TokenUtils.needValidate(url)))
  )
    return next();

  const invalid = (expired = false) =>
    res
      .status(401)
      .json({ message: `${expired ? "Expired" : "Invalid"} session` });

  const { authorization } = req.headers;

  if (!authorization) return invalid(false);

  const { valid, expired, data } = await TokenUtils.validateToken({
    token: authorization,
  });
  if (!valid) return invalid(expired);

  req.user = data;

  return next();
}
