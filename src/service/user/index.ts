import express from "express";

import routes from "./user.routes";

export const userRoutes = express.Router().use("/user", routes);
