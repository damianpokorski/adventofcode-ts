export {};

// Array extensions -  a bit naughty but it's just convenient
declare global {
  interface Array<T> {
    /**
     * Filters & removes repeated objects from an array
     */
    distinct(): T[];

    /**
     * Zips it together with another array of matching type
     * @param other Other array
     * @param enforceLengthMatch whether it should reject if array lengths are different
     */
    zip<T>(other: T[], enforceLengthMatch?: boolean): [T, T][];

    /**
     * Sums up an array of numbers using reduction
     */
    sum<T extends number>(): T;
  }

  interface String {
    massReplace(replaces: Record<string, string>): string;
  }
}

if (!Array.prototype.distinct) {
  Array.prototype.distinct = function <T>() {
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
