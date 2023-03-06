import express from "express";

import routes from "./system.routes";

export const systemRoutes = express.Router().use("/system", routes);
