import mongoose from "mongoose";

import { logger } from "./logger";

export async function connect(pid = "Not informed"): Promise<void> {
  const { MONGO_USER, MONGO_PASS, MONGO_HOST, MONGO_DB } = process.env;
  const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}/${MONGO_DB}?retryWrites=true&w=majority`;
  const config = {
    url,
    params: {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      keepAlive: true,
      keepAliveInitialDelay: 300000,
    },
  };

  mongoose.connect(config.url, config.params);

  mongoose.connection.on("connected", () =>
    logger.info(`Connected ${MONGO_DB}@${MONGO_HOST} on PID ${pid}`),
  );

  mongoose.connection.on("disconneected", () => {
    logger.warn(`Disconnected from ${MONGO_HOST}`);
    logger.warn(`Trying to reconnect ${MONGO_DB}@${MONGO_HOST}`);
    setTimeout(() => mongoose.connect(config.url, config.params), 5000);
  });

  mongoose.connection.on("error", (error) =>
    logger.error(
      `Error on MongoDb Connection ${MONGO_DB}@${MONGO_HOST}: ${error.message}`,
    ),
  );

  mongoose.connection.on("reconnected", () =>
    logger.info(
      `Successfully reconnected ${MONGO_DB}@${MONGO_HOST} on PID ${pid}`,
    ),
  );

  process.on("SIGINT", () =>
    mongoose.connection.close(() => {
      logger.warn(
        `MongoDb disconeted ${MONGO_DB}@${MONGO_HOST} by the end of service`,
      );
      process.exit(0);
    }),
  );
}
