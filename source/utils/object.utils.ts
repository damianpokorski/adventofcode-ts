export {};

// Object extensions -  a bit naughty but it's just tooo convenient for puzzle purposes
declare global {
  interface Object {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toObjectEntries(): [string, any][];
  }
}

if (!Object.prototype.toObjectEntries) {
  Object.prototype.toObjectEntries = function () {
    return Object.entries(this);
  };
}
