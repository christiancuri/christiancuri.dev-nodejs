import express from "express";

import { CatchErrors } from "@utils";

import * as controller from "./user.controller";

export default express
  .Router()
  .get("/info", CatchErrors(controller.getUserInfo))
  .post("/", CatchErrors(controller.updateUserInfo));
