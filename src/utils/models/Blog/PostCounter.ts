import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@plugin(getters)
@modelOptions({
  options: { customName: "postCounter" },
  schemaOptions,
})
export class IPostCounter extends TimeStamps {
  @prop(id)
  public _id?: string;

  @prop({ default: 0 })
  public counter?: number;
}

export const PostCounter = getModel(IPostCounter);
