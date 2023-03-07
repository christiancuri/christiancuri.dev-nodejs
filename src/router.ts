import express, { Express } from "express";

import { ErrorHandle } from "@middlewares";

import { Migrator } from "@utils";

import { blogRoutes } from "./service/blog";
import { systemRoutes } from "./service/system";
import { userRoutes } from "./service/user";

export async function router(app: Express): Promise<Express> {
  Migrator.migrate();

  const router = express
    .Router()
    .use(systemRoutes)
    .use(blogRoutes)
    .use(userRoutes);

  app.use("/", router).use(ErrorHandle);

  return app;
}
