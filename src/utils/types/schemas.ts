/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Types } from "mongoose";

export const id = {
  type: "ObjectId",
  auto: true,
  get: String,
  set: (v) => v,
};

export const refOpts = {
  type: "ObjectId",
  get: (val) => (Types.ObjectId.isValid(val) ? String(val) : val),
  set: (val) => Types.ObjectId(String(val)),
};

export const schemaOptions = {
  timestamps: true,
  minimize: false,
  versionKey: false,
};
