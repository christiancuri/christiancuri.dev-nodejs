import express from "express";

import routes from "./routes";

export const userRoutes = express.Router().use("/user", routes);
