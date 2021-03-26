import { Req, Res } from "@utils";

import * as service from "./service";

export async function getUserInfo(req: Req, res: Res): Promise<void> {
  const { userId } = req.user;

  const userInfo = await service.getUserInfo(userId);

  res.json(userInfo);
}
