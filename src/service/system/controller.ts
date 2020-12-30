import { Req, Res, Validator } from "@utils";

import * as service from "./service";

export async function login(req: Req, res: Res): Promise<Res> {
  const { email, password } = Validator.validate(req.body, "email password");

  return service.loginUser({ email, password }).then((data) => res.json(data));
}
