import express from "express";

import { CatchErrors } from "@utils";

import * as controller from "./controller";

export default express.Router().post("/login", CatchErrors(controller.login));
