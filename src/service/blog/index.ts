import express from "express";

import routes from "./blog.routes";

export const blogRoutes = express.Router().use("/blog", routes);
