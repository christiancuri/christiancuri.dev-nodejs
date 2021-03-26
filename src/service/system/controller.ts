import { Req, Res, Validator } from "@utils";

import * as service from "./service";

export async function login(req: Req, res: Res): Promise<void> {
  const { email, password } = Validator.validate(req.body, "email password");

  const userAccess = await service.loginUser({ email, password });

  res.json(userAccess);
}

export async function getUserInfo(req: Req, res: Res): Promise<void> {
  const { userId } = req.user;

  const userInfo = await service.getUserInfo(userId);

  res.json(userInfo);
}
