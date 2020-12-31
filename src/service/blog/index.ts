import express from "express";

import routes from "./routes";

export const blogRoutes = express.Router().use("/blog", routes);
