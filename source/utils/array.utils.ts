// All of the utils files break conventions :) But it's fun

export {};

// Array extensions -  a bit naughty but it's just convenient
declare global {
  interface Array<T> {
    /**
     * Filters & removes repeated objects from an array - only works for scalar values (strings, numbers etc)
     */
    distinct(hash?: (a: T) => string | number): T[];

    /**
     * Zips it together with another array of matching type
     * @param other Other array
     * @param enforceLengthMatch whether it should reject if array lengths are different
     */
    zip(other: T[], enforceLengthMatch?: boolean): [T, T][];

    /**
     * Sums up an array of numbers using reduction
     */
    sum<T extends number>(): T;

    /**
     * Groups object into a hashmap of arrays
     * @param keyGenerator - generates a key to be used in a dashmap
     */
    groupBy<U extends string | number>(keyGenerator: (value: T) => U): Record<U, T[]>;

    /**
     * Returns array result in form of pairs, i.e. for:
     * [1,2,3,4,5]
     * [[1,2], [2,3], [3,4], [4,5]]
     */
    pairwise(): [T, T][];

    abortable<U>(fn: (self: T[]) => U): U | undefined;
    // abortableReduce(
    //   callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
    //   initialValue?: T
    // ): T;
    abortableReduce<U>(
      callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
      initialValue: U
    ): U;
  }

  interface String {
    massReplace(replaces: Record<string, string>): string;
  }
}

if (!Array.prototype.distinct) {
  Array.prototype.distinct = function <T>(hash?: (arg: T) => string | number) {
    if (hash) {
      return Object.values(
        this.reduce(
          (hashmap, value) => {
            hashmap[hash(value)] = value;
            return hashmap;
          },
          {} as Record<string | number, T>
        )
      );
    }
    return [...new Set<T>([...this])];
  };
}

if (!Array.prototype.zip) {
  Array.prototype.zip = function <T>(other: T[], enforceLengthMatch = true) {
    if (enforceLengthMatch && this.length !== other.length) {
      throw new Error('Attempting to zip arrays of mismatched sizes');
    }

    const result = [] as [T, T][];
    for (let i = 0; i < this.length; i++) {
      result.push([this[i], other[i]]);
    }
    return result;
  };
}

if (!Array.prototype.sum) {
  Array.prototype.sum = function <T extends number>() {
    return this.reduce((a, b) => a + b, 0) as T;
  };
}

if (!Array.prototype.groupBy) {
  Array.prototype.groupBy = function <T, U extends string | number>(
    keyGenerator: (arg: T) => U
  ): Record<U, T[]> {
    const groups = {} as Record<U, T[]>;

    for (const entry of this) {
      const key = keyGenerator(entry);
      if (groups[key] == undefined) {
        groups[key] = [];
      }
      groups[key].push(entry);
    }

    return groups;
  };
}

if (!Array.prototype.pairwise) {
  Array.prototype.pairwise = function <T>(): [T, T][] {
    return this.map((_, index) => [this[index - 1], this[index]]).slice(1) as [T, T][];
  };
}

export class EarlyReturn<T> extends Error {
  constructor(public value: T) {
    super();
  }
}

if (!Array.prototype.abortable) {
  Array.prototype.abortable = function <T, U>(fn: (self: T[]) => U): U | undefined {
    try {
      // Run inner call
      return fn(this);
    } catch (error) {
      // Capture early return value
      if (error instanceof EarlyReturn) {
        return error.value as U;
      }
      // Anything else is rethrown
      throw error;
    }
  };
}

if (!Array.prototype.abortableReduce) {
  Array.prototype.abortableReduce = function <T, U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U
  ): U {
    return this.abortable((self) => {
      return self.reduce(callbackfn, initialValue);
    });
  };
}
