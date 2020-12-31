import express from "express";

import { CatchErrors } from "@utils";

import * as controller from "./controller";

export default express
  .Router()
  .get("/posts", CatchErrors(controller.getPosts))
  .post("/admin/post", CatchErrors(controller.createPost));
