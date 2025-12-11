export const memoize = <Result, Arg1, Arg2, Arg3, Arg4>(
  fn: (arg: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4) => Result,
  hashMethod?: (arg: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4) => string
): ((arg: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4) => Result) => {
  const cache = new Map<string, Result>();
  if (hashMethod == undefined) {
    hashMethod = (arg: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4) => `${arg}`;
  }
  return (arg: Arg1, arg2?: Arg2, arg3?: Arg3, arg4?: Arg4) => {
    const hash = hashMethod(arg);

    if (cache.has(hash) == false) {
      cache.set(hash, fn(arg, arg2, arg3, arg4));
    }
    return cache.get(hash)!;
  };
};
