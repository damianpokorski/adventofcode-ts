import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return (
    input
      .fromStringToNumberArray()
      // Map each row to sets - either sets of 2 or sets of 3, ignore invalid sets
      .map((_, i, array) => array.slice(i - +part, i + 1))
      .filter((window) => window.length > 0)
      // Part 1, compare diffs directly, part 2 - compare sums sets instead
      .map((window, i, other) =>
        part == 1 ? window : [other[i - 1]?.sum(), other[i]?.sum()]
      )
      // Filter any values that contain null values
      .filter((a) => a.every((item) => item))
      // Compare & return number of sets
      .filter((a) => a[0] < a[1]).length
  );
}).tests(
  `199
200
208
210
200
207
240
269
260
263`.split('\n'),
  7,
  5
);
