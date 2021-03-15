import { NextFunction } from "express";

import { Req, Res } from "./types/express";

export const CatchErrors = (fn: (...args: any) => Promise<any>) => async (
  req: Req,
  res: Res,
  next: NextFunction,
): Promise<void> => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};
