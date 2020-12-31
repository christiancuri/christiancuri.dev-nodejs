import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./service";

export async function getPosts(req: Req, res: Res): Promise<Res> {
  const pagination = req.query;

  const posts = await service.getPosts(pagination);

  return res.json(posts);
}

export async function createPost(req: Req, res: Res): Promise<Res> {
  const { userId } = req.user;

  const { title, picture, description, body } = Validator.validate(
    req.body,
    "title picture description body",
  );

  const post = await service.createPost(
    { title, picture, description, body },
    { userId },
  );

  return res.json(post);
}
