import { basename } from 'path';

export type Years = 2023 | 2024 | '.';

export type Days =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | '.';

export type Part = 1 | 2 | '.';

export type Solution = (part: Part, input: string[]) => Promise<string>;

/** Naughty global state for convenient */
export const registry = {} as Record<Years, Record<Days, Solution>>;

/** Registers new puzzle */
export const register = (
  year: Years,
  day: Days,
  solution: Solution
): Solution => {
  // Create year entry if it does not exist
  registry[year] = registry[year] ?? {};

  // Add day entry
  registry[year][day] = solution;
  return solution;
};

export const filenameToYear = (filename: string) =>
  parseInt(basename(filename).substring(0, 4)) as Years;
export const filenameToDay = (filename: string) =>
  parseInt(basename(filename).substring(4, 6)) as Days;

export const registerUsingFilename = (filename: string, solution: Solution) => {
  return register(filenameToYear(filename), filenameToDay(filename), solution);
};

export const findUsingFilename = (filename: string): Solution => {
  const year = filenameToYear(filename);
  const day = filenameToDay(filename);
  const match = registry[year] && registry[year][day];
  if (!match) {
    throw new Error(`Failed to find puzzle using filename ${filename}`);
  }
  return match;
};

export const execute = async (
  year: Years,
  day: Days,
  part: Part,
  input: string[]
) => {
  if (!registry[year]) {
    throw new Error(`No solutions registered for year: ${year}`);
  }
  if (!registry[year][day]) {
    throw new Error(`No solutions registered for year/day: ${year}/${day}`);
  }
  // Execute & Return particular solution
  return await registry[year][day](part, input);
};

/**
 * Utility function for getting selected items out of registry
 * @param predicate
 * @returns
 */
export const getRegistryItems = (
  predicate: (year: Years, day: Days) => boolean
) => {
  return (
    Object.entries(registry)
      .map(([year, days]) =>
        Object.entries(days).map(([day, fn]) => [year, day, fn])
      )
      .flat() as [Years, Days, Solution][]
  ).filter(([year, day]) => predicate(year, day));
};
