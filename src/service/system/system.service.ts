import axios from "axios";

import { IUser, User } from "@models";

import {
  TokenUtils,
  PasswordHelper,
  HTTP400Error,
  HTTP401Error,
  Doc,
} from "@utils";

export async function userExists(email: string): Promise<boolean> {
  const userCount = await User.countDocuments({
    email: new RegExp(`^${email}$`, "i"),
  });
  return userCount > 0;
}

export async function getUserByEmail(email: string): Promise<Doc<IUser>> {
  return User.findOne({
    email: { $eq: email },
  })
    .select("+hash")
    .lean();
}

export async function createLoginToken(user: Doc<IUser>): Promise<string> {
  return TokenUtils.createToken({ user });
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<{ accessToken: string }> {
  const user = await getUserByEmail(email);
  if (!user) throw new HTTP400Error("User not found");
  const { hash } = user;
  const passwordMatchs = await PasswordHelper.compare(password, hash);
  if (!passwordMatchs) throw new HTTP401Error("Invalid password");

  const accessToken = await createLoginToken(user);
  return {
    accessToken,
  };
}

export async function triggerDeploy(): Promise<{ status: number }> {
  const response = await axios.post(
    `https://api.github.com/repos/ChristianCuri-dev/christiancuri-site-nextjs/dispatches`,
    {
      event_type: "deploy",
    },
    {
      headers: {
        Accept: "application/vnd.github.everest-preview+json",
        "Content-Type": "application/json",
      },
      auth: {
        username: "x-oauth-basic",
        password: process.env.GH_TOKEN,
      },
    },
  );

  return {
    status: response.status,
  };
}
