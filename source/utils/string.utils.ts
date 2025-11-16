export const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
export const vovels = 'aeiou'.split('');
export const consnants = alphabet.filter(
  (letter) => vovels.includes(letter) == false
);

// String extensions
declare global {
  interface String {
    massReplace(replaces: Record<string, string>): string;

    /**
     * Can search substring either direction for the subset value & returns first matching subset
     * It starts from first character and then extends, or starts from last and goes all the way up to the first
     * Returns undefined if no match
     * @param predicate a function used to evalute substring
     * @param direction ltr - left to right, rtl - right to left, default to ltr if not provided
     */
    substringFind(
      predicate: (value: string) => boolean,
      direction?: 'ltr' | 'rtl'
    ): string | undefined;

    /**
     * Very unlikely I'll need to reuse this - but just in case
     * Maps 'one' to '1' etc. 1-9
     */
    swapSpelledOutDigitsToNumbers(): string;

    hasNumber(): boolean;
    isNumber(): boolean;

    /**
     * Extracts numeric values from string, i.e. -5.19, 3.14, 5, 500, 0.00001 etc.
     */
    extractNumbers(): number[];

    getVovels(): string[];
    getConsonants(): string[];

    windows(length: number): Generator<string, void, unknown>;
  }
}

if (!String.prototype.massReplace) {
  String.prototype.massReplace = function (replaces) {
    const result = Object.entries(replaces).reduce(
      (value, pair) => value.split(pair[0]).join(pair[1]),
      `${this}`
    );

    return result;
  };
}

if (!String.prototype.substringFind) {
  String.prototype.substringFind = function (predicate, direction = 'ltr') {
    for (let i = 0; i < this.length; i++) {
      const substr =
        direction == 'ltr'
          ? this.substring(0, i + 1)
          : this.substring(this.length - i - 1);

      if (predicate(substr)) {
        return substr;
      }
    }
    return undefined;
  };
}

if (!String.prototype.swapSpelledOutDigitsToNumbers) {
  String.prototype.swapSpelledOutDigitsToNumbers = function () {
    return this.massReplace({
      one: '1',
      two: '2',
      three: '3',
      four: '4',
      five: '5',
      six: '6',
      seven: '7',
      eight: '8',
      nine: '9',
      zero: '0'
    });
  };
}

if (!String.prototype.isNumber) {
  String.prototype.isNumber = function () {
    return this !== '' && Number.isFinite(Number(this));
  };
}

if (!String.prototype.hasNumber) {
  String.prototype.hasNumber = function () {
    return /\d/g.test(`${this}`);
  };
}

if (!String.prototype.extractNumbers) {
  String.prototype.extractNumbers = function () {
    const match = this.matchAll(/(([+-]*\d*\.*\d+))/g);
    if (match == null) {
      return [];
    }
    return [...match].map((value) => {
      return parseFloat(value[0]);
    });
  };
}

if (!String.prototype.getVovels) {
  String.prototype.getVovels = function () {
    return this.split('').filter((letter) => vovels.includes(letter));
  };
}

if (!String.prototype.getConsonants) {
  String.prototype.getConsonants = function () {
    return this.split('').filter((letter) => consnants.includes(letter));
  };
}

if (!String.prototype.windows) {
  String.prototype.windows = function* (substrLength: number) {
    for (let i = 0; i <= this.length - (substrLength - 1); i++) {
      const slice = this.slice(i, i + substrLength);
      if (slice.length == substrLength) {
        yield slice;
      }
    }
  };
}
