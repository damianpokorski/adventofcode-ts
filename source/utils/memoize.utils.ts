export const memoize = <T, U>(fn: (arg: T) => U, hashMethod?: (arg: T) => string): ((arg: T) => U) => {
  const cache = {} as Record<string, U>;
  if (hashMethod == undefined) {
    hashMethod = (arg: T) => `${arg}`;
  }
  return (arg) => {
    const hash = hashMethod(arg);
    if (cache[hash] == undefined) {
      cache[hash] = fn(arg);
    }
    return cache[hash];
  };
};
