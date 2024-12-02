export {};

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
    substringFind(predicate: (value: string) => boolean, direction?: 'ltr' | 'rtl'): string | undefined;
  }
}

if (!String.prototype.massReplace) {
  String.prototype.massReplace = function (replaces) {
    const result = Object.entries(replaces).reduce((value, pair) => value.split(pair[0]).join(pair[1]), `${this}`);

    return result;
  };
}

if (!String.prototype.substringFind) {
  String.prototype.substringFind = function (predicate, direction = 'ltr') {
    for (let i = 0; i < this.length; i++) {
      const substr = direction == 'ltr' ? this.substring(0, i + 1) : this.substring(this.length - i - 1);

      if (predicate(substr)) {
        return substr;
      }
    }
    return undefined;
  };
}
