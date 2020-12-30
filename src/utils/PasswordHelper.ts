import bcrypt from "bcrypt";

const ROUNDS = 15;

export async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function compare(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
