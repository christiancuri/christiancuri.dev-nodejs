import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@plugin(getters)
@modelOptions({
  options: { customName: "user" },
  schemaOptions,
})
export class IUser extends TimeStamps {
  @prop(id)
  public _id?: string;

  @prop({ required: true })
  public email: string;

  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public hash: string;
}

export const User = getModel(IUser);
