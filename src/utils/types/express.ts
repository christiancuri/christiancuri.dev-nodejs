import { Request, Response as Res } from "express";
import * as core from "express-serve-static-core";
import type { Details as UserAgentDetails } from "express-useragent";

export type TokenProps = {
  ip?: string;
  _id: string;
  userId: string;
  isAdmin: boolean;
};

declare module "express" {
  interface Request {
    user?: TokenProps;
    getUrl(): string;
  }
}

type ReqProps = {
  Params?: core.ParamsDictionary;
  Queryparams?: core.Query | Record<string, any>;
  Body?: any;
};

type Req<T extends ReqProps = ReqProps> = Request<
  T["Params"],
  any,
  T["Body"],
  T["Queryparams"]
>;

export { Req, Res, UserAgentDetails };
