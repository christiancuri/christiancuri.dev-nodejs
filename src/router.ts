import express, { Express } from "express";

import { ErrorHandle } from "@middlewares";

import { Migrator } from "@utils";

import { systemRoutes } from "./service/system";

export async function router(app: Express): Promise<Express> {
  Migrator.migrate();

  const router = express.Router().use(systemRoutes);

  app.use("/api", router).use(ErrorHandle);

  return app;
}
