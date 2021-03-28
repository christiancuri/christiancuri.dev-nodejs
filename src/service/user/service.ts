import { Types } from "mongoose";

import { IUser, User } from "@models";

import { HTTP400Error, Doc, clone, PasswordHelper } from "@utils";

export const SELECT_USER_PUBLIC_FIELDS = {
  name: 1,
  email: 1,
  picture: 1,
};

export type TSelectUserPublicFields = keyof typeof SELECT_USER_PUBLIC_FIELDS;

export async function getUserInfo(
  userId: string,
): Promise<Pick<Doc<IUser>, TSelectUserPublicFields>> {
  if (!userId || !Types.ObjectId.isValid(userId))
    throw new HTTP400Error("Invalid id");
  const user = await User.findById(userId)
    .select(SELECT_USER_PUBLIC_FIELDS)
    .lean();

  if (!user) throw new HTTP400Error("User not found");

  return user;
}

export async function updateUserInfo(
  userId: string,
  {
    name,
    email,
    picture,
    cPassword,
    nPassword,
  }: Partial<
    Omit<Doc<IUser>, "_id"> & { cPassword: string; nPassword: string }
  >,
): Promise<Pick<Doc<IUser>, TSelectUserPublicFields>> {
  if (!userId || !Types.ObjectId.isValid(userId))
    throw new HTTP400Error("Invalid id");

  const payload = clone({
    name,
    email,
    picture,
  });

  if (!Object.keys(payload)) throw new HTTP400Error("Missing params");

  const user = await User.findById(userId).select("+hash +email");

  if (cPassword && nPassword) {
    if (!(await PasswordHelper.compare(cPassword, user.hash)))
      throw new HTTP400Error("Invalid password");
    user.hash = await PasswordHelper.hash(nPassword);
  }

  Object.assign(user, payload);

  const nUser = await user.save();

  return {
    name: nUser.name,
    email: nUser.email,
    picture: nUser.picture,
  };
}
