// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

import moduleAlias from "module-alias";

moduleAlias.addAliases({
  "@utils": `${__dirname}/utils`,
  "@models": `${__dirname}/utils/models`,
  "@middlewares": `${__dirname}/utils/middlewares`,
  "@types": `${__dirname}/utils/types`,
  "@": `${__dirname}/*`,
});

moduleAlias();

import { router } from "./router";
import { app, MongoDB } from "./utils/index";

(async function () {
  await MongoDB.connect(process.pid.toString());
  router(app);
})();
