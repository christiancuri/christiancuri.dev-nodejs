import { NextFunction } from "express";

import { HTTPClientError } from "@/utils/HttpErrors";
import { Req, Res } from "@/utils/types";

import * as ErrorHandlerService from "./ErrorHandler";

export function ErrorHandle(
  err: HTTPClientError,
  req: Req,
  res: Res,
  next: NextFunction,
): void {
  return err.statusCode
    ? ErrorHandlerService.clientError(err, req, res, next)
    : ErrorHandlerService.serverError(err, req, res, next);
}
