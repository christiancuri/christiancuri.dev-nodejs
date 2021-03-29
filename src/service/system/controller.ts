import { Req, Res, Validator } from "@utils";

import * as service from "./service";

export async function login(req: Req, res: Res): Promise<void> {
  const { email, password } = Validator.validate(req.body, "email password");

  const userAccess = await service.loginUser({ email, password });

  res.json(userAccess);
}

export async function remoteDeploy(_: Req, res: Res): Promise<void> {
  const status = await service.triggerDeploy();

  res.json(status);
}
