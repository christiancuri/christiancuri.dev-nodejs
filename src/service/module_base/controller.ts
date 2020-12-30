import { Req, Res } from "@types";

import * as service from "./service";

export async function example(req: Req, res: Res): Promise<Res> {
  return service.example({ props: undefined }).then((data) => res.json(data));
}
