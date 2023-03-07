import { Model, Document } from "mongoose";

import { getModelForClass } from "@typegoose/typegoose";

export type Reference<R> = string & { check?: R };

export class AnyArray {
  public somethings?: any[];
}

export type Doc<T> = Partial<T>;

export type DocumentType<T> = T & Document;

type PopulateSubDocument<T, K> = {
  [x in keyof T]: T[x] extends Reference<infer R>
    ? x extends K
      ? R
      : T[x]
    : T[x] extends Reference<infer R>[]
    ? x extends K
      ? R[]
      : T[x]
    : T[x];
};

export type Populate<T, K extends keyof T> = T extends (infer A)[]
  ? PopulateSubDocument<A, K>[]
  : PopulateSubDocument<T, K>;

export interface MyModel<T, K extends Document = DocumentType<T>>
  extends Model<K, T> {
  //
}

export function getModel<T>(model: new () => T): MyModel<T> {
  return getModelForClass(model as any) as MyModel<T>;
}
