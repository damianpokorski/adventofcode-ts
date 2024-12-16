import { Vector } from './vector.utils';

export const floodFill = <T>(vector: Vector, getter: (v: Vector) => T) => {
  const set = [] as Vector[];
  const value = getter(vector);
  // If value is not set - return nothing
  if (value == undefined) {
    return set;
  }

  // Add current node to the set
  set.push(vector);

  while (true) {
    // Expand
    const expands = set
      // -> Filter to adjecent matching values & flatten
      .map((cell) => cell.adjecents().filter((adjecent) => getter(adjecent) == value))
      .flat()
      .distinct((v) => v.hash())
      // -> Ignore ones already in our set
      .filter((cell) => !set.find((knownCell) => knownCell.equals(cell)));

    if (expands.length == 0) {
      break;
    }
    set.push(...expands);
  }
  return set;
};
