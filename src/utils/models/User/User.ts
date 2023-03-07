import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export enum UserRole {
  MEMBER = "member",
  ADMIN = "admin",
}

@plugin(getters)
@modelOptions({
  options: { customName: "user" },
  schemaOptions,
})
export class IUser extends TimeStamps implements Base<string> {
  id: string;

  @prop(id)
  public _id: string;

  @prop({ required: true, select: false })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop()
  public picture: string;

  @prop({ required: true, select: false })
  public hash: string;

  @prop({
    required: true,
    default: UserRole.MEMBER,
    enum: UserRole,
    select: false,
  })
  public role: UserRole;
}

export const User = getModel(IUser);
