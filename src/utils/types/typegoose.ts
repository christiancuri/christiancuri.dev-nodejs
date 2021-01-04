/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/ban-types */
import { Model, Document, Query, DocumentQuery, Types } from "mongoose";

import { getModelForClass } from "@typegoose/typegoose";

export type Reference<R> = string & { check?: R };

export class AnyArray {
  public somethings?: any[];
}

export type Doc<T> = Partial<
  {
    [P in keyof T]: Partial<T[P]> extends Reference<infer R>
      ? string
      : Partial<T[P]> extends Reference<infer R>[]
      ? string[]
      : T[P] extends String
      ? string
      : T[P] extends AnyArray
      ? any[]
      : T[P] extends Map<string, string>
      ? { [key: string]: string }
      : T[P];
  }
>;

export type DocumentType<T> = Doc<T> & Document;

export type Populate<T, K> = T extends (infer A)[]
  ? {
      [x in keyof A]: A[x] extends Reference<infer R>
        ? x extends K
          ? Doc<R>
          : A[x]
        : A[x] extends Reference<infer R>[]
        ? x extends K
          ? Doc<R>[]
          : A[x]
        : A[x];
    }[]
  : {
      [x in keyof T]: T[x] extends Reference<infer R>
        ? x extends K
          ? Doc<R>
          : T[x]
        : T[x] extends Reference<infer R>[]
        ? x extends K
          ? Doc<R>[]
          : T[x]
        : T[x];
    };

type OnlyActualRefsNames<T> = {
  [K in keyof T]: T[K] extends Reference<infer R>
    ? K
    : T[K] extends Reference<infer R>[]
    ? K
    : never;
}[keyof T];

type OnlyActualRefs<T> = Pick<T, OnlyActualRefsNames<T>>;

type ArrayFixOnlyActualRefs<T> = T extends (infer A)[]
  ? OnlyActualRefs<A>
  : OnlyActualRefs<T>;

(Query.prototype as any).populateTs = function populateTs(props) {
  return this.populate(props);
};

export interface MyModel<T, K extends Document = DocumentType<T>>
  extends Model<K, T> {}

export interface MyDocumentQuery<T, DocType extends Document, QueryHelpers = {}>
  extends DocumentQuery<T, DocType, QueryHelpers> {}

declare module "mongoose" {
  interface DocumentQuery<T, DocType extends Document, QueryHelpers = {}>
    extends mquery {
    populateTs<P extends keyof ArrayFixOnlyActualRefs<QueryHelpers>>(
      prop: P[],
    ): DocumentQuery<
      Doc<Populate<T extends (infer A)[] ? QueryHelpers[] : QueryHelpers, P>>,
      Doc<Populate<QueryHelpers, P>> & Document
    > &
      QueryHelpers;
  }
}

export function getModel<T>(model: new () => T): MyModel<T> {
  return getModelForClass(model as any) as any;
}

type IPromiseResolvedType<T> = T extends Promise<infer R> ? R : never;
export type PromiseType<T extends (...args: any) => any> = IPromiseResolvedType<
  ReturnType<T>
>;
