import { NextFunction } from "express";

import { HTTPClientError } from "@/utils/HttpErrors";
import { Req, Res } from "@/utils/types";

import { logger } from "../../";

export function clientError(
  err: HTTPClientError,
  req: Req,
  res: Res,
  next: NextFunction,
): void {
  res.status(err.statusCode).json({ message: err.message || err });
  next();
}

export function serverError(
  err: HTTPClientError,
  req: Req,
  res: Res,
  next: NextFunction,
): void {
  const message = err.stack ? `\n ${err.stack}` : ` - ${err}`;
  logger.error(`${new Date()} - ${req.method} - ${req.url} ${message}`);
  res.status(500).json({ message: err.message || err });
  next();
}
