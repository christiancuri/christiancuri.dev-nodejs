import express from "express";

import routes from "./routes";

export const exampleRoutes = express.Router().use("/example", routes);
