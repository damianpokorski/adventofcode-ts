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
export interface Options {
  verbose?: boolean;
  isTest?: boolean;
}
export type Solution = (
  part: Part,
  input: string[],
  options: Options
) => Promise<string | number | undefined>;

/** Naughty global state for convenient */
export const registry = {} as Record<Years, Record<Days, Solution>>;

/** Registers new puzzle */
export const register = (year: Years, day: Days, solution: Solution): Solution => {
  // Create year entry if it does not exist
  registry[year] = registry[year] ?? {};

  // Add day entry
  registry[year][day] = solution;
  return solution;
};

export const filenameToYear = (filename: string) => parseInt(basename(filename).substring(0, 4)) as Years;
export const filenameToDay = (filename: string) => parseInt(basename(filename).substring(4, 6)) as Days;

export const findUsingFilename = (filename: string): Solution => {
  const year = filenameToYear(filename);
  const day = filenameToDay(filename);
  const match = registry[year] && registry[year][day];
  if (!match) {
    throw new Error(`Failed to find puzzle using filename ${filename}`);
  }
  return match;
};
export const findTestUsingFilename = (filename: string, part: Part) => {
  const year = filenameToYear(filename);
  const day = filenameToDay(filename);
  const match = testRegistry[year] && testRegistry[year][day] && testRegistry[year][day][part];
  if (!match) {
    throw new Error(`Failed to find puzzle tests using filename ${filename}`);
  }
  return match;
};

/**
 * Utility function for getting selected items out of registry
 * @param predicate
 * @returns
 */
export const getRegistryItems = (predicate: (year: Years, day: Days) => boolean) => {
  return (
    Object.entries(registry)
      .map(([year, days]) => Object.entries(days).map(([day, fn]) => [year, day, fn]))
      .flat() as [Years, Days, Solution][]
  ).filter(([year, day]) => predicate(year, day));
};

/** Registering test data */
/* Year/Day/Part = [input[], expectedOutput] */
export const testRegistry = {} as Record<Years, Record<Days, Record<Part, [string[], string]>>>;
export const addTest = (filename: string, part: Part, input: string[], expectedResult: string) => {
  const year = filenameToYear(filename);
  const day = filenameToDay(filename);
  // console.log({ filename, year, day, part, expectedResult });
  if (!testRegistry[year]) {
    testRegistry[year] = {} as Record<Days, Record<Part, [string[], string]>>;
  }

  if (!testRegistry[year][day]) {
    testRegistry[year][day] = {} as Record<Part, [string[], string]>;
  }
  if (!testRegistry[year][day][part]) {
    testRegistry[year][day][part] = [input, expectedResult];
  }
};

/** Runs registered solution if found */
export const execute = async (year: Years, day: Days, part: Part, input: string[], opts: Options) => {
  if (!registry[year]) {
    throw new Error(`No solutions registered for year: ${year}`);
  }
  if (!registry[year][day]) {
    throw new Error(`No solutions registered for year/day: ${year}/${day}`);
  }

  // Execute & Return particular solution
  return await registry[year][day](part, input, opts);
};

/** Runs registered solution if found */
export const executeTest = async (year: Years, day: Days, part: Part, opts: Options) => {
  if (!registry[year]) {
    throw new Error(`No solutions registered for year: ${year}`);
  }
  if (!registry[year][day]) {
    throw new Error(`No solutions registered for year/day: ${year}/${day}`);
  }

  // Execute test if available
  if (testRegistry[year] && testRegistry[year][day] && testRegistry[year][day][part]) {
    const [testInput, expectedResult] = testRegistry[year][day][part];
    const testResult = await registry[year][day](part, testInput, { ...opts, isTest: true });
    if (testResult == expectedResult) {
      return true;
    } else {
      console.log(`${year} / ${day} - Test failed - expected ${expectedResult} received ${testResult}`);
      return false;
    }
  }
  return undefined;
};

/**
 * Helper class for chaining commands without having to use __filename ref
 */
export class RegistryHelper {
  private year: Years;
  private day: Days;
  constructor(public filename: string) {
    this.year = filenameToYear(this.filename);
    this.day = filenameToDay(this.filename);
  }

  solver(solution: Solution) {
    register(this.year, this.day, solution);
    return this;
  }

  test(part: Part, input: string[], expectedOutput: string | number) {
    addTest(this.filename, part, input, expectedOutput.toString());
    return this;
  }

  tests(
    input: string[],
    expectedOutputPart1: string | number,
    expectedOutputPart2?: string | number | undefined
  ) {
    addTest(this.filename, 1, input, expectedOutputPart1.toString());
    if (expectedOutputPart2 !== undefined) {
      addTest(this.filename, 2, input, expectedOutputPart2.toString());
    }
    return this;
  }
}

export const initialize = (filename: string, solution: Solution) => {
  return new RegistryHelper(filename).solver(solution);
};
