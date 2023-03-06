export function omit<T extends Record<any, any>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  if (!keys.length) return obj;

  const { [keys.pop()]: _nothing, ...rest } = obj;

  return omit(rest, keys as never) as Omit<T, K>;
}

export function clone<T = any>(object: T): T {
  try {
    return JSON.parse(JSON.stringify(object));
  } catch (error) {
    return object;
  }
}
