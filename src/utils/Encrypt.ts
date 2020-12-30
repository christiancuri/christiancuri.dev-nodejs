import crypto from "crypto";
import forge from "node-forge";

import * as Crypt from "./TokenCrypt";

// These functions use dynamic vector and key (or manual key [Eg: key = userId]) to encrypt data using aes-cbc
const algorithm = "aes-256-cbc";
const aesHashSize = 2 << 4;

async function _encryptData(str = "", key?: string): Promise<string> {
  const hasKey = key !== undefined;
  key = hasKey
    ? generateHash(String(key), aesHashSize)
    : crypto.randomBytes(4 << 3).toString("hex");
  return hasKey ? Crypt.encryptText(key, str) : Crypt.encrypt(key, str);
}

export async function encrypt(str: string, manualKey: string): Promise<string> {
  try {
    if (str) {
      const data = JSON.stringify(str);
      const key = crypto.randomBytes(4 << 3);
      const iv = crypto.randomBytes(2 << 3);
      const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
      const encryptedData = Buffer.concat([
        cipher.update(data),
        cipher.final(),
      ]);
      const dataObject = {
        i: iv.toString("hex"),
        v: key.toString("hex"),
        b: encryptedData.toString("hex"),
      };
      return _encryptData(
        forge.util.encode64(JSON.stringify(dataObject)),
        manualKey,
      );
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

async function _decryptData(str = "", key?: string): Promise<string> {
  return key !== undefined
    ? Crypt.decryptText(generateHash(String(key), aesHashSize), str)
    : Crypt.decrypt(str);
}

export async function decrypt(
  encodedData: string,
  manualKey: string,
): Promise<string> {
  try {
    if (encodedData) {
      const dataObject = JSON.parse(
        forge.util.decode64(_decryptData(encodedData, manualKey)),
      );
      const iv = Buffer.from(dataObject.i, "hex");
      const key = Buffer.from(dataObject.v, "hex");
      const data = Buffer.from(dataObject.b, "hex");
      const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
      const decryptedData = Buffer.concat([
        decipher.update(data),
        decipher.final(),
      ]);
      return JSON.parse(decryptedData.toString());
    }
    return undefined;
  } catch (error) {
    return undefined;
  }
}

function generateHash(str: string, size = 32): string {
  if (str.length > size) {
    str = str.substr(0, size);
  } else if (str.length < size) {
    while (str.length < size) str += str.substr(0, size - str.length);
  }
  return str;
}
