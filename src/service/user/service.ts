import { Types } from "mongoose";

import { IUser, User } from "@models";

import { HTTP400Error, Doc } from "@utils";

export async function getUserInfo(userId: string): Promise<Doc<IUser>> {
  if (!userId || !Types.ObjectId.isValid(userId))
    throw new HTTP400Error("Invalid id");

  const user = await User.findById(userId).select("name email").lean();

  if (!user) throw new HTTP400Error("User not found");

  return user;
}
