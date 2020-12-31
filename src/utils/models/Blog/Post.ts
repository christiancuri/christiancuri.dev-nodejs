import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id, Reference, refOpts } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

import { IUser } from "../User";

@plugin(getters)
@modelOptions({
  options: { customName: "post" },
  schemaOptions,
})
export class IPost extends TimeStamps {
  @prop(id)
  public _id?: string;

  @prop({ required: true })
  public title: string;

  @prop({ required: true })
  public uri: string;

  @prop()
  public picture?: string;

  @prop()
  public description?: string;

  @prop()
  public body?: string;

  @prop({ required: true, ref: IUser, ...refOpts })
  public author: Reference<IUser>;
}

export const Post = getModel(IPost);
