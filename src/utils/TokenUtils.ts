import fs from "fs";
import { sign, verify } from "jsonwebtoken";
import path from "path";

import { IUser } from "./models/User";
import * as TokenCrypt from "./TokenCrypt";
import { Doc, TokenProps } from "./types";

const PKPath = path.resolve(__dirname, "../../jwt.pem");
const PK = fs.readFileSync(PKPath);

async function _createToken(
  key: string,
  content: { [s: string]: any },
): Promise<string> {
  const encryptedContent = await TokenCrypt.encrypt(
    String(key),
    JSON.stringify(content),
  );
  const token = sign(
    {
      token: encryptedContent,
    },
    PK,
    {
      expiresIn: "90d",
    },
  );
  return TokenCrypt.encrypt(String(key), token);
}

export async function createToken(
  { user }: { user: Doc<IUser> },
  isAdmin = false,
): Promise<string> {
  const { _id: userId } = user;

  const tokenContent: TokenProps = {
    _id: userId,
    userId,
    isAdmin: !!isAdmin,
  };

  return _createToken(userId, tokenContent);
}

export async function validateToken({
  token,
}: {
  token: string;
}): Promise<{
  valid: boolean;
  expired: boolean;
  data?: TokenProps;
}> {
  const jwt = await TokenCrypt.decrypt(token);

  const invalid = (expired = false) => ({
    valid: false,
    expired,
    data: undefined,
  });
  const valid = (info: TokenProps) => ({
    valid: true,
    expired: false,
    data: info,
  });

  if (!jwt) return invalid(false);

  try {
    const jwtData = verify(jwt, PK, {});
    if (!jwtData.token) return invalid(false);
    const data = await TokenCrypt.decrypt(jwtData.token);
    const userData: TokenProps = JSON.parse(data);
    return valid(userData);
  } catch (error) {
    return invalid(false);
  }
}

export async function needValidate(url: string): Promise<boolean> {
  const whitelist = ["/api/system/login", "/api/blog/post"];

  const whiteListEndsWidth = [];

  for (const wlUrl of whitelist) if (url.startsWith(wlUrl)) return false;

  for (const wlUrl of whiteListEndsWidth) if (url.endsWith(wlUrl)) return false;

  return true;
}
