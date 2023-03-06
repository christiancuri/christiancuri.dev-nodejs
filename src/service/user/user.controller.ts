import { Req, Res } from "@utils";

import * as service from "./user.service";

export async function getUserInfo(req: Req, res: Res): Promise<void> {
  const { userId } = req.user;

  const userInfo = await service.getUserInfo(userId);

  res.json(userInfo);
}

export async function updateUserInfo(req: Req, res: Res): Promise<void> {
  const { userId } = req.user;

  const { name, email, picture } = req.body;

  const user = await service.updateUserInfo(userId, { name, email, picture });

  res.json(user);
}
