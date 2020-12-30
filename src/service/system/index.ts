import express from "express";

import routes from "./routes";

export const systemRoutes = express.Router().use("/system", routes);
