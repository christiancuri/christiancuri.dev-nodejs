import { json, urlencoded } from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import http from "http";
import morgan from "morgan";

import { logger } from "./logger";
import { UserTokenMiddleware } from "./middlewares/Token";
import { UserMiddleware } from "./middlewares/User";

const app = express();
const httpServer = http.createServer(app);

app
  .use(helmet())
  .use(cors())
  .use(
    json({
      limit: "20mb",
    }),
  )
  .use(
    urlencoded({
      extended: true,
      limit: "20mb",
    }),
  )
  .use(UserTokenMiddleware)
  .use(UserMiddleware)
  .use(
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
      useTempFiles: true,
      tempFileDir: "./tmp/",
      preserveExtension: true,
    }),
  )
  .use(
    morgan("combined", {
      stream: {
        write: (info) => logger.info(info.trim()),
      },
      skip: (req) => req.method === "OPTIONS",
    }),
  )
  .set("trust proxy", true);

const port = process.env.PORT || 5000;
httpServer.listen(port, () => logger.info(`Running on port ${port}`));

export default app;
