import mongoose, { Types } from "mongoose";

import { clone } from "../ObjectUtils";

export const id = {
  type: mongoose.Schema.Types.ObjectId,
  auto: true,
  get: (v) => {
    try {
      return String(v);
    } catch (error) {
      return v;
    }
  },
};

export const refOpts = {
  type: mongoose.Schema.Types.ObjectId,
  get: (val: Types.ObjectId | Types.ObjectId[]): string | string[] => {
    try {
      return clone<string | string[]>(val as any);
    } catch (error) {
      return val as any;
    }
  },
};

export const archivedProp = { default: false, select: false };
export const schemaOptions = {
  timestamps: true,
  minimize: false,
  versionKey: false,
};
