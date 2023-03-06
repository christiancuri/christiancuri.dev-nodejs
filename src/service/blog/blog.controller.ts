import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./blog.service";

export async function getPosts(req: Req, res: Res): Promise<Res> {
  const pagination = req.query;

  const posts = await service.getPosts(pagination);

  return res.json(posts);
}

export async function getPostsPaths(_: Req, res: Res): Promise<Res> {
  const postsPaths = await service.getPostsPaths();

  return res.json(postsPaths);
}

export async function getPost(req: Req, res: Res): Promise<Res> {
  const { uri } = req.params;

  const post = await service.getPost(uri);

  return res.json(post);
}

export async function getPostById(req: Req, res: Res): Promise<Res> {
  const { id } = req.params;

  const post = await service.getPostById(id);

  return res.json(post);
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

export async function updatePost(req: Req, res: Res): Promise<Res> {
  const { _id, title, picture, description, body } = req.body;

  const updatedPost = await service.updatePost({
    _id,
    title,
    picture,
    description,
    body,
  });

  return res.json(updatedPost);
}

export async function archivePost(req: Req, res: Res): Promise<Res> {
  const { id } = req.params;

  await service.archivePost(id);

  return res.json();
}
