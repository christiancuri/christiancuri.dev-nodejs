import express from "express";

import { CatchErrors } from "@utils";

import * as controller from "./controller";

export default express
  .Router()
  .get("/posts", CatchErrors(controller.getPosts))
  .get("/posts/paths", CatchErrors(controller.getPostsPaths))
  .get("/post/:uri", CatchErrors(controller.getPost))
  .get("/admin/post/:id", CatchErrors(controller.getPostById))
  .post("/admin/post", CatchErrors(controller.createPost))
  .put("/admin/post", CatchErrors(controller.updatePost))
  .delete("/admin/post/:id", CatchErrors(controller.archivePost));
