import '../utils';
import { initialize } from '../utils/registry';

initialize(__filename, async (part, input) => {
  return input
    .map((line) => line.split(/\s+/).fromStringToNumberArray())
    .map((cells) => {
      // Part 1 - Diff of max & mix
      if (part == 1) {
        return Math.max(...cells) - Math.min(...cells);
      }
      // Part 2 Result of two cleanly divided numbers
      // Gotta use permutations here - to lazily check for a/b and b/a
      const [a, b] = cells.permutations(2).find(([a, b]) => {
        return a % b == 0;
      }) as [number, number];
      return a / b;
    })
    .sum();
})
  .test(
    1,
    `5 1 9 5
7 5 3
2 4 6 8`.split('\n'),
    18
  )
  .test(
    2,
    `5 9 2 8
9 4 7 3
3 8 6 5`.split('\n'),
    9
  );
