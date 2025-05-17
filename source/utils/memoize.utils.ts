export const memoize = <T, U>(
  fn: (arg: T) => U,
  hashMethod?: (arg: T) => string
): ((arg: T) => U) => {
  const cache = new Map<string, U>();
  if (hashMethod == undefined) {
    hashMethod = (arg: T) => `${arg}`;
  }
  return (arg) => {
    const hash = hashMethod(arg);

    if (cache.has(hash) == false) {
      cache.set(hash, fn(arg));
    }
    return cache.get(hash)!;
  };
};
